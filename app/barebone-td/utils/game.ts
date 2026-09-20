import {
  PATH,
  PATH_SET,
  ROWS,
  COLS,
  STARTING_GOLD,
  STARTING_LIVES,
  TILE,
  TOWER_DEFS,
  MAX_TOWER_LEVEL,
  PREP_TIME_MS,
  SELL_REFUND_RATE,
  UPGRADE_COST_RATE,
  UPGRADE_DAMAGE_MULT,
  UPGRADE_DURATION_MS,
} from "./constants";
import type {
  Enemy,
  EnemyKind,
  Point,
  Tower,
  TowerType,
  WavePlan,
  World,
} from "../interfaces/BareboneTDTypes";

let ids = 0;
export const nextId = () => ++ids;

export const cellCenter = (row: number, col: number): Point => ({
  x: col * TILE + TILE / 2,
  y: row * TILE + TILE / 2,
});

export const isPathCell = (row: number, col: number) =>
  PATH_SET.has(`${row},${col}`);

export const isBuildable = (row: number, col: number) =>
  row >= 0 && row < ROWS && col >= 0 && col < COLS && !isPathCell(row, col);

export const WAYPOINTS: Point[] = PATH.map(([r, c]) => cellCenter(r, c));

/* ---------------- endless wave progression ---------------- */
export const planWave = (wave: number): WavePlan => {
  const count = Math.min(26, 6 + Math.floor(wave * 1.4));
  const hp = Math.round(16 * Math.pow(1.115, wave - 1));
  const speed = Math.min(150, 68 + wave * 1.4);
  const reward = Math.max(3, Math.round(7 - wave * 0.05));
  const spawnInterval = Math.max(280, 820 - wave * 8);
  const queue: EnemyKind[] = Array.from({ length: count }, () => "grunt");
  if (wave % 5 === 0) queue.push("brute");
  return { hp, speed, reward, spawnInterval, queue };
};

export const initWorld = (): World => {
  ids = 0;
  return {
    phase: "playing",
    wave: 0,
    waveActive: false,
    gold: STARTING_GOLD,
    lives: STARTING_LIVES,
    towers: [],
    enemies: [],
    projectiles: [],
    impacts: [],
    spawnQueue: [],
    spawnTimer: 0,
    currentPlan: null,
    recorded: false,
    prepTimer: PREP_TIME_MS,
  };
};

export const startWave = (w: World) => {
  if (w.waveActive || w.phase === "gameover") return;
  w.wave += 1;
  const plan = planWave(w.wave);
  w.currentPlan = plan;
  w.spawnQueue = [...plan.queue];
  w.spawnTimer = 0;
  w.waveActive = true;
};

export const tryPlaceTower = (
  w: World,
  type: TowerType,
  row: number,
  col: number,
): boolean => {
  if (w.phase === "gameover" || w.waveActive) return false;
  if (!isBuildable(row, col)) return false;
  if (w.towers.some((t) => t.row === row && t.col === col)) return false;
  const def = TOWER_DEFS[type];
  if (w.gold < def.cost) return false;
  const c = cellCenter(row, col);
  w.gold -= def.cost;
  w.towers.push({
    id: nextId(),
    type,
    row,
    col,
    x: c.x,
    y: c.y,
    lastFired: -Infinity,
    level: 1,
    totalCost: def.cost,
  });
  return true;
};

export const getUpgradeCost = (tower: Tower): number =>
  Math.round(TOWER_DEFS[tower.type].cost * UPGRADE_COST_RATE * tower.level);

export const upgradeTower = (w: World, id: number): boolean => {
  if (w.waveActive) return false;
  const tower = w.towers.find((t) => t.id === id);
  if (!tower) return false;
  if (tower.level >= MAX_TOWER_LEVEL) return false;
  const cost = getUpgradeCost(tower);
  if (w.gold < cost) return false;
  w.gold -= cost;
  tower.level += 1;
  tower.totalCost += cost;
  return true;
};

export const sellTower = (w: World, id: number): boolean => {
  if (w.waveActive) return false;
  const index = w.towers.findIndex((t) => t.id === id);
  if (index === -1) return false;
  const [tower] = w.towers.splice(index, 1);
  w.gold += Math.round(tower.totalCost * SELL_REFUND_RATE);
  return true;
};

const spawnEnemy = (w: World, kind: EnemyKind, plan: WavePlan) => {
  const p0 = WAYPOINTS[0];
  const brute = kind === "brute";
  const hp = brute ? Math.round(plan.hp * 6) : plan.hp;
  const enemy: Enemy = {
    id: nextId(),
    kind,
    x: p0.x,
    y: p0.y,
    wp: 1,
    traveled: 0,
    hp,
    maxHp: hp,
    baseSpeed: brute ? plan.speed * 0.62 : plan.speed,
    reward: brute ? plan.reward * 6 : plan.reward,
    size: brute ? 40 : 26,
    slowUntil: 0,
    slowFactor: 1,
    hitFlash: 0,
  };
  w.enemies.push(enemy);
};

const moveEnemies = (w: World, dt: number, now: number) => {
  const keep: Enemy[] = [];
  for (const e of w.enemies) {
    const target = WAYPOINTS[e.wp];
    if (!target) {
      w.lives = Math.max(0, w.lives - 1);
      continue;
    }
    const spd = e.baseSpeed * (now < e.slowUntil ? e.slowFactor : 1);
    const dx = target.x - e.x;
    const dy = target.y - e.y;
    const d = Math.hypot(dx, dy) || 0.0001;
    const step = spd * dt;
    if (step >= d) {
      e.traveled += d;
      e.x = target.x;
      e.y = target.y;
      e.wp += 1;
    } else {
      e.x += (dx / d) * step;
      e.y += (dy / d) * step;
      e.traveled += step;
    }
    keep.push(e);
  }
  w.enemies = keep;
};

const applyDamage = (w: World, e: Enemy, dmg: number, now: number) => {
  if (e.hp <= 0) return;
  e.hp -= dmg;
  e.hitFlash = now + 120;
  if (e.hp <= 0) {
    e.hp = 0;
    w.gold += e.reward;
  }
};

const fireTowers = (w: World, now: number) => {
  for (const t of w.towers) {
    const def = TOWER_DEFS[t.type];
    if (now - t.lastFired < def.cooldown) continue;
    let best: Enemy | null = null;
    for (const e of w.enemies) {
      if (e.hp <= 0) continue;
      const d = Math.hypot(e.x - t.x, e.y - t.y);
      if (d <= def.range + e.size / 2 && (!best || e.traveled > best.traveled))
        best = e;
    }
    if (!best) continue;
    t.lastFired = now;
    const dist = Math.hypot(best.x - t.x, best.y - t.y) || 1;
    const travelTime = (dist / def.projectileSpeed) * 1000;
    const levelBonus = t.level - 1;
    const isDurationTower = def.slowDuration != null;
    const damage = isDurationTower
      ? def.damage
      : def.damage * (1 + UPGRADE_DAMAGE_MULT * levelBonus);
    const slowDuration = isDurationTower
      ? def.slowDuration! + UPGRADE_DURATION_MS * levelBonus
      : def.slowDuration;
    w.projectiles.push({
      id: nextId(),
      type: t.type,
      fromX: t.x,
      fromY: t.y,
      toX: best.x,
      toY: best.y,
      startedAt: now,
      travelTime,
      targetId: best.id,
      damage,
      splashRadius: def.splashRadius,
      slowFactor: def.slowFactor,
      slowDuration,
    });
  }
};

const updateProjectiles = (w: World, now: number) => {
  const remaining = [];
  for (const p of w.projectiles) {
    if (now - p.startedAt < p.travelTime) {
      remaining.push(p);
      continue;
    }
    const def = TOWER_DEFS[p.type];
    w.impacts.push({
      key: nextId(),
      x: p.toX,
      y: p.toY,
      t: 0,
      radius: p.splashRadius ?? 10,
      color: def.color,
    });
    if (p.type === "splash" && p.splashRadius) {
      for (const e of w.enemies) {
        if (Math.hypot(e.x - p.toX, e.y - p.toY) <= p.splashRadius)
          applyDamage(w, e, p.damage, now);
      }
    } else {
      const target = w.enemies.find((e) => e.id === p.targetId);
      if (target) {
        applyDamage(w, target, p.damage, now);
        if (p.type === "slow" && p.slowFactor && p.slowDuration) {
          target.slowUntil = now + p.slowDuration;
          target.slowFactor = p.slowFactor;
        }
      }
    }
  }
  w.projectiles = remaining;
};

const ageImpacts = (w: World, dt: number) => {
  for (const i of w.impacts) i.t += dt;
  w.impacts = w.impacts.filter((i) => i.t < 0.4);
};

export const step = (w: World, dt: number, now: number) => {
  if (w.phase === "gameover") {
    ageImpacts(w, dt);
    return;
  }

  if (w.waveActive && w.currentPlan) {
    if (w.spawnQueue.length > 0) {
      w.spawnTimer -= dt * 1000;
      if (w.spawnTimer <= 0) {
        const kind = w.spawnQueue.shift()!;
        spawnEnemy(w, kind, w.currentPlan);
        w.spawnTimer = w.currentPlan.spawnInterval;
      }
    }
    moveEnemies(w, dt, now);
    fireTowers(w, now);
  }

  updateProjectiles(w, now);
  w.enemies = w.enemies.filter((e) => e.hp > 0);
  ageImpacts(w, dt);

  if (w.lives <= 0) {
    w.phase = "gameover";
    w.waveActive = false;
    return;
  }

  if (w.waveActive && w.spawnQueue.length === 0 && w.enemies.length === 0) {
    w.waveActive = false;
    w.prepTimer = PREP_TIME_MS;
  }

  if (!w.waveActive) {
    w.prepTimer -= dt * 1000;
    if (w.prepTimer <= 0) startWave(w);
  }
};
