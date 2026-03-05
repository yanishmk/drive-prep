import { useId } from "react";
import Image from "next/image";
import type {
  CardinalDirection,
  CarMove,
  Intersection4WayIllustration,
  IntersectionCar,
  IntersectionVehicleKind,
  PhotoIllustration,
  QuestionIllustration,
} from "@/lib/permis/types";

type Props = {
  illustration: QuestionIllustration;
  revealSolution?: boolean;
};

type Point = { x: number; y: number };

const ROAD = {
  ground: "#84cc16",
  asphalt: "#52525b",
  intersection: "#4b5563",
  shoulder: "#f8fafc",
  marking: "#ffffff",
  center: "#facc15",
};

const VEHICLE_POSITIONS: Record<CardinalDirection, { x: number; y: number; angle: number }> = {
  N: { x: 160, y: 72, angle: 90 },
  S: { x: 160, y: 248, angle: -90 },
  E: { x: 248, y: 160, angle: 180 },
  W: { x: 72, y: 160, angle: 0 },
};

const PATH_START: Record<CardinalDirection, Point> = {
  N: { x: 160, y: 106 },
  S: { x: 160, y: 214 },
  E: { x: 214, y: 160 },
  W: { x: 106, y: 160 },
};

const PATH_END: Record<CardinalDirection, Point> = {
  N: { x: 160, y: 72 },
  S: { x: 160, y: 248 },
  E: { x: 248, y: 160 },
  W: { x: 72, y: 160 },
};

const STOP_LINES: Record<CardinalDirection, string> = {
  N: "M120 116 L200 116",
  S: "M120 204 L200 204",
  E: "M204 120 L204 200",
  W: "M116 120 L116 200",
};

const CONTROL_LABEL_POSITIONS: Record<CardinalDirection, Point> = {
  N: { x: 160, y: 102 },
  S: { x: 160, y: 218 },
  E: { x: 218, y: 160 },
  W: { x: 102, y: 160 },
};

const CONTROL_SIGN_POSITIONS: Record<CardinalDirection, { x: number; y: number; rotate: number }> = {
  N: { x: 214, y: 94, rotate: 0 },
  S: { x: 106, y: 226, rotate: 180 },
  E: { x: 226, y: 106, rotate: 90 },
  W: { x: 94, y: 214, rotate: -90 },
};

const PEDESTRIAN_POSITIONS: Record<CardinalDirection, Point> = {
  N: { x: 160, y: 124 },
  S: { x: 160, y: 196 },
  E: { x: 196, y: 160 },
  W: { x: 124, y: 160 },
};

function opposite(direction: CardinalDirection): CardinalDirection {
  if (direction === "N") return "S";
  if (direction === "S") return "N";
  if (direction === "E") return "W";
  return "E";
}

function turnTarget(from: CardinalDirection, move: CarMove): CardinalDirection {
  if (move === "straight") return opposite(from);

  if (move === "left") {
    if (from === "N") return "E";
    if (from === "S") return "W";
    if (from === "E") return "S";
    return "N";
  }

  if (from === "N") return "W";
  if (from === "S") return "E";
  if (from === "E") return "N";
  return "S";
}

function getPath(vehicle: IntersectionCar): string {
  const start = PATH_START[vehicle.from];
  const targetDirection = turnTarget(vehicle.from, vehicle.move);
  const end = PATH_END[targetDirection];

  if (vehicle.move === "straight") {
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  return `M ${start.x} ${start.y} Q 160 160 ${end.x} ${end.y}`;
}

function controlLabel(value: "none" | "stop" | "yield"): string {
  if (value === "stop") return "ARRET";
  if (value === "yield") return "CEDEZ";
  return "";
}

function fromLabel(value: CardinalDirection): string {
  if (value === "N") return "nord";
  if (value === "S") return "sud";
  if (value === "E") return "est";
  return "ouest";
}

function moveLabel(value: CarMove): string {
  if (value === "left") return "tourne a gauche";
  if (value === "right") return "tourne a droite";
  return "va tout droit";
}

function pedestrianAtLabel(value: CardinalDirection): string {
  if (value === "N") return "traverse au nord";
  if (value === "S") return "traverse au sud";
  if (value === "E") return "traverse a l est";
  return "traverse a l ouest";
}

function kindLabel(value: IntersectionVehicleKind | undefined): string {
  if (value === "bus") return "autobus";
  if (value === "truck") return "camion";
  if (value === "emergency") return "urgence";
  if (value === "cyclist") return "cycliste";
  return "voiture";
}

function drawVehicleBody(vehicle: IntersectionCar) {
  const kind = vehicle.kind ?? "car";

  if (kind === "cyclist") {
    return (
      <>
        <circle cx="-10" cy="2" r="5" fill="none" stroke="#0f172a" strokeWidth="1.8" />
        <circle cx="10" cy="2" r="5" fill="none" stroke="#0f172a" strokeWidth="1.8" />
        <path d="M-10 2 L-2 -5 L8 2 L-1 2 Z" fill="none" stroke="#0f172a" strokeWidth="1.8" />
        <line x1="-2" y1="-5" x2="3" y2="-11" stroke="#0f172a" strokeWidth="1.8" />
        <circle cx="3" cy="-12" r="3" fill="#0f172a" />
      </>
    );
  }

  if (kind === "bus") {
    return (
      <>
        <rect
          x={-24}
          y={-11}
          width={48}
          height={22}
          rx={5}
          fill={vehicle.color ?? "#0ea5e9"}
          stroke="#0f172a"
          strokeWidth="1.4"
        />
        <rect x={-17} y={-7} width={34} height={6} rx="2" fill="#e2e8f0" opacity="0.95" />
        <rect x={-20} y={0} width={40} height={6} rx="2" fill="#f8fafc" opacity="0.8" />
        <circle cx="-15" cy="12" r="2.7" fill="#0f172a" />
        <circle cx="15" cy="12" r="2.7" fill="#0f172a" />
        <rect x="20" y="-4" width="4" height="8" rx="1" fill="#fef08a" />
      </>
    );
  }

  if (kind === "truck") {
    return (
      <>
        <rect
          x={-23}
          y={-10}
          width={30}
          height={20}
          rx={3}
          fill={vehicle.color ?? "#64748b"}
          stroke="#0f172a"
          strokeWidth="1.4"
        />
        <rect
          x={7}
          y={-8}
          width={14}
          height={16}
          rx={2}
          fill="#94a3b8"
          stroke="#0f172a"
          strokeWidth="1.4"
        />
        <rect x={12} y={-4} width={9} height={8} rx="1.5" fill="#fef08a" />
        <circle cx="-14" cy="11" r="2.5" fill="#0f172a" />
        <circle cx="15" cy="11" r="2.5" fill="#0f172a" />
      </>
    );
  }

  if (kind === "emergency") {
    return (
      <>
        <rect
          x={-21}
          y={-10}
          width={42}
          height={20}
          rx={4}
          fill={vehicle.color ?? "#dc2626"}
          stroke="#0f172a"
          strokeWidth="1.4"
        />
        <rect x={-6} y={-15} width={12} height={5} rx={1.8} fill="#60a5fa" />
        <rect x={-12} y={-6} width={24} height={5} rx={2} fill="#fee2e2" opacity="0.95" />
        <circle cx="-12" cy="11" r="2.5" fill="#0f172a" />
        <circle cx="12" cy="11" r="2.5" fill="#0f172a" />
        <rect x="17" y="-4" width="4" height="8" rx="1" fill="#fef08a" />
      </>
    );
  }

  return (
    <>
      <rect
        x={-21}
        y={-10}
        width={42}
        height={20}
        rx={5}
        fill={vehicle.color ?? "#0f766e"}
        stroke="#0f172a"
        strokeWidth="1.4"
      />
      <rect x={-13} y={-6} width={26} height={5} rx={2} fill="#c7d2fe" opacity="0.95" />
      <rect x={-13} y={1} width={26} height={4.5} rx={2} fill="#dbeafe" opacity="0.85" />
      <rect x={17} y={-4} width={4} height={8} rx="1" fill="#fef08a" />
      <circle cx="-12" cy="11" r="2.5" fill="#0f172a" />
      <circle cx="12" cy="11" r="2.5" fill="#0f172a" />
    </>
  );
}

function drawCrosswalk(direction: CardinalDirection) {
  if (direction === "N") {
    return (
      <>
        <rect x="124" y="118" width="8" height="12" fill={ROAD.marking} opacity="0.8" />
        <rect x="140" y="118" width="8" height="12" fill={ROAD.marking} opacity="0.8" />
        <rect x="156" y="118" width="8" height="12" fill={ROAD.marking} opacity="0.8" />
        <rect x="172" y="118" width="8" height="12" fill={ROAD.marking} opacity="0.8" />
        <rect x="188" y="118" width="8" height="12" fill={ROAD.marking} opacity="0.8" />
      </>
    );
  }

  if (direction === "S") {
    return (
      <>
        <rect x="124" y="190" width="8" height="12" fill={ROAD.marking} opacity="0.8" />
        <rect x="140" y="190" width="8" height="12" fill={ROAD.marking} opacity="0.8" />
        <rect x="156" y="190" width="8" height="12" fill={ROAD.marking} opacity="0.8" />
        <rect x="172" y="190" width="8" height="12" fill={ROAD.marking} opacity="0.8" />
        <rect x="188" y="190" width="8" height="12" fill={ROAD.marking} opacity="0.8" />
      </>
    );
  }

  if (direction === "E") {
    return (
      <>
        <rect x="190" y="124" width="12" height="8" fill={ROAD.marking} opacity="0.8" />
        <rect x="190" y="140" width="12" height="8" fill={ROAD.marking} opacity="0.8" />
        <rect x="190" y="156" width="12" height="8" fill={ROAD.marking} opacity="0.8" />
        <rect x="190" y="172" width="12" height="8" fill={ROAD.marking} opacity="0.8" />
        <rect x="190" y="188" width="12" height="8" fill={ROAD.marking} opacity="0.8" />
      </>
    );
  }

  return (
    <>
      <rect x="118" y="124" width="12" height="8" fill={ROAD.marking} opacity="0.8" />
      <rect x="118" y="140" width="12" height="8" fill={ROAD.marking} opacity="0.8" />
      <rect x="118" y="156" width="12" height="8" fill={ROAD.marking} opacity="0.8" />
      <rect x="118" y="172" width="12" height="8" fill={ROAD.marking} opacity="0.8" />
      <rect x="118" y="188" width="12" height="8" fill={ROAD.marking} opacity="0.8" />
    </>
  );
}

function drawControlSign(control: "none" | "stop" | "yield") {
  if (control === "stop") {
    return (
      <g>
        <polygon
          points="0,-10 7,-7 10,0 7,7 0,10 -7,7 -10,0 -7,-7"
          fill="#dc2626"
          stroke="#ffffff"
          strokeWidth="1.3"
        />
        <text
          x="0"
          y="1"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="3.6"
          fontWeight="800"
          fill="#ffffff"
        >
          STOP
        </text>
      </g>
    );
  }

  if (control === "yield") {
    return (
      <g>
        <polygon points="0,-10 9,8 -9,8" fill="#dc2626" />
        <polygon points="0,-6.5 5.6,5.2 -5.6,5.2" fill="#ffffff" />
      </g>
    );
  }

  return null;
}

function Intersection4WayScene({
  illustration,
  revealSolution = false,
}: {
  illustration: Intersection4WayIllustration;
  revealSolution?: boolean;
}) {
  const markerId = useId().replace(/:/g, "");
  const controls = illustration.controls ?? {};
  const pedestrians = illustration.pedestrians ?? [];
  const pedestrianCrosswalkDirections = Array.from(new Set(pedestrians.map((p) => p.at)));

  return (
    <figure className="mt-4 rounded-xl border border-slate-200 bg-[#f3f7eb] p-4">
      <svg
        viewBox="0 0 320 320"
        role="img"
        aria-label="Illustration vue du ciel d une intersection avec vehicules"
        className="mx-auto aspect-square w-full max-w-[360px] rounded-lg border border-slate-300 bg-[#84cc16]"
      >
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="#334155" />
          </marker>
        </defs>

        <rect x="0" y="0" width="320" height="320" fill={ROAD.ground} />
        <rect x="120" y="0" width="80" height="320" fill={ROAD.asphalt} />
        <rect x="0" y="120" width="320" height="80" fill={ROAD.asphalt} />
        <rect x="120" y="120" width="80" height="80" fill={ROAD.intersection} />

        <line x1="120" y1="0" x2="120" y2="320" stroke={ROAD.shoulder} strokeWidth="2" />
        <line x1="200" y1="0" x2="200" y2="320" stroke={ROAD.shoulder} strokeWidth="2" />
        <line x1="0" y1="120" x2="320" y2="120" stroke={ROAD.shoulder} strokeWidth="2" />
        <line x1="0" y1="200" x2="320" y2="200" stroke={ROAD.shoulder} strokeWidth="2" />

        <line
          x1="160"
          y1="0"
          x2="160"
          y2="120"
          stroke={ROAD.center}
          strokeWidth="2"
          strokeDasharray="8 8"
        />
        <line
          x1="160"
          y1="200"
          x2="160"
          y2="320"
          stroke={ROAD.center}
          strokeWidth="2"
          strokeDasharray="8 8"
        />
        <line
          x1="0"
          y1="160"
          x2="120"
          y2="160"
          stroke={ROAD.center}
          strokeWidth="2"
          strokeDasharray="8 8"
        />
        <line
          x1="200"
          y1="160"
          x2="320"
          y2="160"
          stroke={ROAD.center}
          strokeWidth="2"
          strokeDasharray="8 8"
        />

        {pedestrianCrosswalkDirections.map((direction) => (
          <g key={`crosswalk-${direction}`}>{drawCrosswalk(direction)}</g>
        ))}

        {(["N", "S", "E", "W"] as const).map((direction) => {
          const control = controls[direction] ?? "none";
          if (control === "none") return null;
          const labelPos = CONTROL_LABEL_POSITIONS[direction];
          const signPos = CONTROL_SIGN_POSITIONS[direction];
          return (
            <g key={`control-${direction}`}>
              <path d={STOP_LINES[direction]} stroke={ROAD.marking} strokeWidth="3" />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fontWeight="700"
                fill="#1e293b"
              >
                {controlLabel(control)}
              </text>
              <g transform={`translate(${signPos.x} ${signPos.y}) rotate(${signPos.rotate})`}>
                {drawControlSign(control)}
              </g>
            </g>
          );
        })}

        {revealSolution
          ? illustration.cars.map((vehicle) => (
              <path
                key={`path-${vehicle.id}`}
                d={getPath(vehicle)}
                fill="none"
                stroke={vehicle.kind === "cyclist" ? "#0f766e" : "#334155"}
                strokeWidth={vehicle.kind === "cyclist" ? "2" : "2.25"}
                strokeOpacity="0.75"
                strokeDasharray={vehicle.kind === "cyclist" ? "5 4" : undefined}
                markerEnd={`url(#${markerId})`}
              />
            ))
          : null}

        {illustration.cars.map((vehicle) => {
          const position = VEHICLE_POSITIONS[vehicle.from];
          const isFirst = revealSolution && illustration.firstPassId === vehicle.id;
          return (
            <g
              key={`vehicle-${vehicle.id}`}
              transform={`translate(${position.x} ${position.y}) rotate(${position.angle})`}
            >
              <ellipse cx="0" cy="12" rx="22" ry="5.5" fill="#0f172a" opacity="0.18" />
              {isFirst ? (
                <rect
                  x={-22}
                  y={-14}
                  width={44}
                  height={28}
                  rx={8}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />
              ) : null}
              {drawVehicleBody(vehicle)}
              {revealSolution ? (
                <text
                  x="0"
                  y="2"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="8"
                  fontWeight="700"
                  fill={vehicle.kind === "cyclist" ? "#0f172a" : "#ffffff"}
                  transform={`rotate(${-position.angle})`}
                >
                  {vehicle.id}
                </text>
              ) : null}
            </g>
          );
        })}

        {pedestrians.map((pedestrian) => {
          const pos = PEDESTRIAN_POSITIONS[pedestrian.at];
          return (
            <g key={`pedestrian-${pedestrian.id}`} transform={`translate(${pos.x} ${pos.y})`}>
              <circle cx="0" cy="-4" r="2.4" fill={pedestrian.color ?? "#be123c"} />
              <line x1="0" y1="-2" x2="0" y2="5" stroke={pedestrian.color ?? "#be123c"} strokeWidth="1.7" />
              <line x1="-3.5" y1="1" x2="3.5" y2="1" stroke={pedestrian.color ?? "#be123c"} strokeWidth="1.4" />
              <line x1="0" y1="5" x2="-3" y2="9" stroke={pedestrian.color ?? "#be123c"} strokeWidth="1.4" />
              <line x1="0" y1="5" x2="3" y2="9" stroke={pedestrian.color ?? "#be123c"} strokeWidth="1.4" />
              <text x="5" y="-5" fontSize="8" fill="#7f1d1d" fontWeight="700">
                {pedestrian.id}
              </text>
            </g>
          );
        })}
      </svg>

      {revealSolution ? (
        <div className="mt-3 space-y-1 text-xs text-slate-600">
          {illustration.context ? <p>{illustration.context}</p> : null}
          <ul className="space-y-1">
            {illustration.cars.map((vehicle) => (
              <li key={`legend-${vehicle.id}`}>
                {vehicle.id} ({kindLabel(vehicle.kind)}): arrive du {fromLabel(vehicle.from)},{" "}
                {moveLabel(vehicle.move)}.
              </li>
            ))}
            {pedestrians.map((pedestrian) => (
              <li key={`legend-ped-${pedestrian.id}`}>
                {pedestrian.id} (pieton): {pedestrianAtLabel(pedestrian.at)}.
              </li>
            ))}
          </ul>
          {illustration.firstPassId ? (
            <p className="font-semibold text-amber-700">
              Correction illustration: {illustration.firstPassId} passe en premier.
            </p>
          ) : null}
        </div>
      ) : null}
    </figure>
  );
}

function PhotoScene({ illustration }: { illustration: PhotoIllustration }) {
  const isScene = illustration.imageUrl.includes("/illustrations/scenes/");
  return (
    <figure className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
      <div className="relative">
        {illustration.overlayTag && !isScene ? (
          <span className="absolute left-4 top-4 z-10 rounded-full border border-white/70 bg-slate-900/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
            {illustration.overlayTag}
          </span>
        ) : null}
        <Image
          src={illustration.imageUrl}
          alt={illustration.alt}
          width={1600}
          height={1000}
          sizes="(min-width: 1024px) 48vw, 100vw"
          className={`aspect-[4/3] w-full bg-[#f1f5f9] ${
            isScene ? "p-2 object-contain" : "p-4 object-contain"
          }`}
        />
      </div>
    </figure>
  );
}

export function QuestionIllustrationView({ illustration, revealSolution = false }: Props) {
  if (illustration.kind === "intersection_4way") {
    return <Intersection4WayScene illustration={illustration} revealSolution={revealSolution} />;
  }

  if (illustration.kind === "photo") {
    return <PhotoScene illustration={illustration} />;
  }

  return null;
}
