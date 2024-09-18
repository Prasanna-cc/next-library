import clsx from "clsx";

export default function ToolBar({
  firstHalf,
  secondHalf,
  responsive = false,
}: {
  firstHalf: React.ReactNode;
  secondHalf: React.ReactNode;
  responsive?: boolean;
}) {
  return (
    <div className="w-full">
      <div
        className={clsx("w-full flex gap-3 justify-between", {
          "flex-col md:flex-row": responsive, // Apply responsive classes if true
          "flex-row": !responsive, // Apply flex-row if not responsive
        })}
      >
        <div className="w-full flex justify-start gap-2">{firstHalf}</div>
        <div
          className={clsx("w-full gap-2 flex", {
            "justify-center md:justify-end": responsive, // Apply center and end in responsive mode
            "justify-end": !responsive, // Apply only justify-end if not responsive
          })}
        >
          {secondHalf}
        </div>
      </div>
    </div>
  );
}
