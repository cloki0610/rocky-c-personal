import { INSTRUCTION_SECTIONS } from "../../utils/instructions";

export default function PoliticsInstructions() {
  return (
    <div className="space-y-4 text-sm text-slate-600">
      {INSTRUCTION_SECTIONS.map(({ title, rules }) => (
        <section key={title}>
          <h3 className="mb-1 font-semibold text-slate-800">{title}</h3>
          <ul className="list-disc space-y-2 pl-5">
            {rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
