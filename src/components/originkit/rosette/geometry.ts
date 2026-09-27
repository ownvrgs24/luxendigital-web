// Metal Rosette — geometry builder (chamfered cube rosette)

export type V3 = [number, number, number];

const CELL = 1;

const ARMS: V3[] = [
  [0, 0, 0],
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

const CHAMFER = 0.09;

const FACES: { n: V3; u: V3; v: V3 }[] = [
  { n: [1, 0, 0], u: [0, 0, -1], v: [0, 1, 0] },
  { n: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0] },
  { n: [0, 1, 0], u: [1, 0, 0], v: [0, 0, -1] },
  { n: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1] },
  { n: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] },
  { n: [0, 0, -1], u: [-1, 0, 0], v: [0, 1, 0] },
];

const CORNERS: [number, number][] = [
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
];

const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};

export function buildRosette() {
  const pos: number[] = [];
  const nrm: number[] = [];
  const arm: number[] = [];
  const idx: number[] = [];
  const h = CELL * 0.5;
  const c = h * CHAMFER;
  const i = h - c;

  for (const a of ARMS) {
    const facet = (verts: V3[], n: V3) => {
      const [p0, p1, p2] = verts;
      const e1: V3 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
      const e2: V3 = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]];
      const g: V3 = [
        e1[1] * e2[2] - e1[2] * e2[1],
        e1[2] * e2[0] - e1[0] * e2[2],
        e1[0] * e2[1] - e1[1] * e2[0],
      ];
      const ordered =
        g[0] * n[0] + g[1] * n[1] + g[2] * n[2] >= 0
          ? verts
          : verts.slice().reverse();
      const base = pos.length / 3;
      for (const v of ordered) {
        pos.push(v[0], v[1], v[2]);
        nrm.push(n[0], n[1], n[2]);
        arm.push(a[0], a[1], a[2]);
      }
      for (let k = 1; k < ordered.length - 1; k++)
        idx.push(base, base + k, base + k + 1);
    };

    for (const f of FACES) {
      facet(
        CORNERS.map(([cu, cv]): V3 => [
          f.n[0] * h + f.u[0] * i * cu + f.v[0] * i * cv,
          f.n[1] * h + f.u[1] * i * cu + f.v[1] * i * cv,
          f.n[2] * h + f.u[2] * i * cu + f.v[2] * i * cv,
        ]),
        f.n,
      );
    }

    for (let ax = 0; ax < 3; ax++) {
      for (let bx = ax + 1; bx < 3; bx++) {
        const wx = 3 - ax - bx;
        for (const sa of [-1, 1]) {
          for (const sb of [-1, 1]) {
            const at = (av: number, bv: number, wv: number): V3 => {
              const p: V3 = [0, 0, 0];
              p[ax] = av;
              p[bx] = bv;
              p[wx] = wv;
              return p;
            };
            const n: V3 = [0, 0, 0];
            n[ax] = sa;
            n[bx] = sb;
            facet(
              [
                at(sa * h, sb * i, i),
                at(sa * i, sb * h, i),
                at(sa * i, sb * h, -i),
                at(sa * h, sb * i, -i),
              ],
              norm(n),
            );
          }
        }
      }
    }

    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        for (const sz of [-1, 1]) {
          facet(
            [
              [sx * h, sy * i, sz * i],
              [sx * i, sy * h, sz * i],
              [sx * i, sy * i, sz * h],
            ],
            norm([sx, sy, sz]),
          );
        }
      }
    }
  }

  return {
    pos: new Float32Array(pos),
    nrm: new Float32Array(nrm),
    arm: new Float32Array(arm),
    idx: new Uint16Array(idx),
  };
}

export { CELL };
