import { CLASSES, TYPES, VIEW_W, WORLD_H, WORLD_W } from "./constants";
import type {
    Attack, ClassId, Enemy, EnemyType, KeyState, Player, Point, RangedAttack,
    SizedEntity, StageEnemies, StagePlan, StageScale, World,
} from "../interfaces/EndlessArenaTypes";

export const rangedDesc = (c: RangedAttack) =>
    c.mode === "stun" ? `stun ${c.duration / 1000}s · ${c.range}px` : `${c.dmg} dmg · ${c.range}px`;

/* ---------------- endless progression ---------------- */
/* stages 1-3 stay exactly as tuned; scaling starts at stage 4 */
export const scaleFor = (stage: number): StageScale => {
    const k = Math.max(0, stage - 3);
    return {
        hp: 1 + 0.22 * k,
        dmg: 1 + 0.09 * k,
        speed: Math.min(1.7, 1 + 0.03 * k),
    };
};

/* every third stage is a boss stage */
export const isBossStage = (stage: number) => stage % 3 === 0;

export const stagePlan = (stage: number): StagePlan => {
    const cycle = ((stage - 1) % 3) + 1;
    const loop = Math.floor((stage - 1) / 3);
    if (cycle === 1) return { minions: Math.min(16, 8 + loop * 2), buffed: Math.min(4, loop), boss: false };
    if (cycle === 2) return { minions: Math.min(18, 11 + loop * 2), buffed: Math.min(5, 1 + loop), boss: false };
    return { minions: Math.min(10, 2 + loop * 2), buffed: Math.min(3, loop), boss: true };
};

let ids = 0;
export const nextId = () => ++ids;
export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
export const center = (e: SizedEntity): Point => ({ x: e.x + e.size / 2, y: e.y + e.size / 2 });
export const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

export const makeEnemy = (type: EnemyType, x: number, y: number, sc: StageScale): Enemy => {
    const t = TYPES[type];
    const hp = Math.round(t.hp * sc.hp);
    return {
        id: nextId(), type, x, y, size: t.size,
        hp, maxHp: hp,
        speed: t.speed * sc.speed,
        dmg: Math.round(t.dmg * sc.dmg),
        cd: t.cd, reach: t.reach,
        lastAtk: 0, flash: 0, stunUntil: 0,
    };
};

export const spawnAt = (size: number, px: number): Point => {
    for (let i = 0; i < 50; i++) {
        const x = 40 + Math.random() * (WORLD_W - 80 - size);
        const y = 40 + Math.random() * (WORLD_H - 110 - size);
        if (Math.abs(x - px) > 280) return { x, y };
    }
    return { x: 60, y: 60 };
};

export const spawnStage = (stage: number, px: number): StageEnemies => {
    const sc = scaleFor(stage);
    const plan = stagePlan(stage);
    const enemies: Enemy[] = [];
    let boss: Enemy | null = null;

    const add = (type: EnemyType) => {
        const p = spawnAt(TYPES[type].size, px);
        enemies.push(makeEnemy(type, p.x, p.y, sc));
    };

    for (let i = 0; i < plan.minions; i++) add("minion");
    for (let i = 0; i < plan.buffed; i++) add("buffed");
    if (plan.boss) boss = makeEnemy("boss", WORLD_W / 2 - TYPES.boss.size / 2, 60, sc);

    return { enemies, boss };
};

export const initWorld = (clsId: ClassId): World => {
    ids = 0;
    const c = CLASSES[clsId];
    const player: Player = {
        cls: c,
        x: WORLD_W / 2 - c.size / 2, y: WORLD_H - 150,
        size: c.size, speed: c.speed,
        hp: c.maxHp, maxHp: c.maxHp,
        melee: c.melee, ranged: c.ranged,
        meleeLast: -9999, meleeUntil: 0,
        rangedLast: -9999, rangedUntil: 0,
        flash: 0, aim: { x: 1, y: 0 },
    };
    const { enemies, boss } = spawnStage(1, player.x);
    return {
        phase: "fighting", stage: 1, player, enemies, boss,
        bullets: [], corpses: [], clearTimer: 0, recorded: false,
        camera: clamp(player.x + player.size / 2 - VIEW_W / 2, 0, WORLD_W - VIEW_W),
    };
};

export const puff = (w: World, x: number, y: number, size: number, color: string) => {
    w.corpses.push({ key: nextId(), x, y, size, color, t: 0, spin: Math.random() < 0.5 ? -1 : 1 });
};

export const fire = (w: World, conf: Attack, now: number) => {
    const p = w.player;
    const pc = center(p);

    if (conf.mode === "projectile") {
        const s = conf.bulletSize;
        w.bullets.push({
            id: nextId(),
            x: pc.x + p.aim.x * (p.size / 2 + 4) - s / 2,
            y: pc.y + p.aim.y * (p.size / 2 + 4) - s / 2,
            dx: p.aim.x, dy: p.aim.y,
            speed: conf.speed, dmg: conf.dmg, size: s,
            travelled: 0, max: conf.range,
            angle: (Math.atan2(p.aim.y, p.aim.x) * 180) / Math.PI,
            color: p.cls.color,
        });
        return;
    }

    if (conf.mode === "stun") {
        // every minion in range — buffed minions and the boss are immune
        for (const e of w.enemies) {
            if (e.type !== "minion" || e.hp <= 0) continue;
            if (dist(pc, center(e)) <= conf.range + e.size / 2) {
                e.stunUntil = now + conf.duration;
            }
        }
        return;
    }

    // instant damage burst (melee swings)
    const targets = w.boss ? [...w.enemies, w.boss] : w.enemies;
    for (const t of targets) {
        if (dist(pc, center(t)) <= conf.range + t.size / 2) {
            t.hp -= conf.dmg;
            t.flash = now + 110;
            if (t.hp <= 0) { t.hp = 0; puff(w, t.x, t.y, t.size, TYPES[t.type].color); }
        }
    }
};

export const step = (w: World, keys: KeyState, dt: number, now: number) => {
    const p = w.player;
    const running = w.phase === "fighting" || w.phase === "clearing";

    if (running) {
        const k = keys;
        const vx = (k.ArrowRight ? 1 : 0) - (k.ArrowLeft ? 1 : 0);
        const vy = (k.ArrowDown ? 1 : 0) - (k.ArrowUp ? 1 : 0);
        if (vx || vy) {
            const m = Math.hypot(vx, vy); // normalise so diagonals aren't faster
            p.x = clamp(p.x + (vx / m) * p.speed * dt, 0, WORLD_W - p.size);
            p.y = clamp(p.y + (vy / m) * p.speed * dt, 0, WORLD_H - p.size);
            p.aim = { x: vx / m, y: vy / m }; // bullets follow the last direction held
        }

        if (k.a && now - p.meleeLast >= p.melee.cd) {
            p.meleeLast = now;
            p.meleeUntil = now + p.melee.show;
            fire(w, p.melee, now);
        }
        if (k.s && now - p.rangedLast >= p.ranged.cd) {
            p.rangedLast = now;
            p.rangedUntil = now + p.ranged.show;
            fire(w, p.ranged, now);
        }

        /* bullets — sub-stepped so fast shots can't tunnel through small enemies */
        w.bullets = w.bullets.filter((b) => {
            const total = b.speed * dt;
            const subs = Math.max(1, Math.ceil(total / 10));
            const inc = total / subs;
            for (let s = 0; s < subs; s++) {
                b.x += b.dx * inc;
                b.y += b.dy * inc;
                b.travelled += inc;
                if (b.travelled >= b.max) { puff(w, b.x, b.y, b.size, b.color); return false; }
                if (b.x < -60 || b.x > WORLD_W + 60 || b.y < -60 || b.y > WORLD_H + 60) return false;

                const bc = { x: b.x + b.size / 2, y: b.y + b.size / 2 };
                const targets = w.boss ? [...w.enemies, w.boss] : w.enemies;
                for (const t of targets) {
                    if (t.hp <= 0) continue;
                    if (dist(bc, center(t)) <= (b.size + t.size) / 2) {
                        t.hp -= b.dmg;
                        t.flash = now + 110;
                        if (t.hp <= 0) { t.hp = 0; puff(w, t.x, t.y, t.size, TYPES[t.type].color); }
                        else puff(w, b.x, b.y, b.size, "#a5f3fc");
                        return false;
                    }
                }
            }
            return true;
        });

        const pc = center(p);
        const all = w.boss ? [...w.enemies, w.boss] : w.enemies;

        for (const e of all) {
            if (e.stunUntil > now) continue; // stunned: no chase, no attack
            const ec = center(e);
            const d = dist(pc, ec) || 1;
            if (d > e.reach - 6) {
                e.x = clamp(e.x + ((pc.x - ec.x) / d) * e.speed * dt, 0, WORLD_W - e.size);
                e.y = clamp(e.y + ((pc.y - ec.y) / d) * e.speed * dt, 0, WORLD_H - e.size);
            }
            if (d <= e.reach && now - e.lastAtk >= e.cd) {
                e.lastAtk = now;
                p.hp = Math.max(0, p.hp - e.dmg);
                p.flash = now + 150;
            }
        }

        // gentle separation so enemies don't stack into one blob
        for (let i = 0; i < all.length; i++) {
            for (let j = i + 1; j < all.length; j++) {
                const a = all[i], b = all[j];
                const ca = center(a), cb = center(b);
                const min = (a.size + b.size) / 2;
                const d = dist(ca, cb) || 0.01;
                if (d < min) {
                    const push = ((min - d) / 2) * 0.6;
                    const nx = (cb.x - ca.x) / d, ny = (cb.y - ca.y) / d;
                    a.x = clamp(a.x - nx * push, 0, WORLD_W - a.size);
                    a.y = clamp(a.y - ny * push, 0, WORLD_H - a.size);
                    b.x = clamp(b.x + nx * push, 0, WORLD_W - b.size);
                    b.y = clamp(b.y + ny * push, 0, WORLD_H - b.size);
                }
            }
        }

        w.enemies = w.enemies.filter((e) => e.hp > 0);
        if (w.boss && w.boss.hp <= 0) w.boss = null;

        if (p.hp <= 0) {
            w.phase = "lost";
            puff(w, p.x, p.y, p.size, p.cls.color);
        } else if (w.phase === "fighting" && w.enemies.length === 0 && !w.boss) {
            w.phase = "clearing";
            w.clearTimer = 1.1; // let the death animations finish first
        } else if (w.phase === "clearing") {
            w.clearTimer -= dt;
            if (w.clearTimer <= 0) {
                w.stage += 1;
                p.maxHp += 5; // small reward so endless doesn't become a pure wall
                p.hp = Math.min(p.maxHp, p.hp + p.cls.heal);
                const s = spawnStage(w.stage, p.x);
                w.enemies = s.enemies;
                w.boss = s.boss;
                w.bullets = [];
                w.phase = "fighting";
            }
        }
    }

    for (const c of w.corpses) c.t += dt;
    w.corpses = w.corpses.filter((c) => c.t < 0.7);

    const target = clamp(p.x + p.size / 2 - VIEW_W / 2, 0, WORLD_W - VIEW_W);
    w.camera += (target - w.camera) * Math.min(1, dt * 8);
};

