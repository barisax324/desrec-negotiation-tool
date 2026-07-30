import type { BodyRegionStatus } from "../../data/bodyMapOptions";

import type { BodyRegionSelection } from "./BodyMap";
import BodyRegion from "./Body-Region";

import frontBodyLineArt from "./Front-Body-Line-Art.png?url";
import frontBodyMask from "./Front-Body-Mask.png?url";

interface FrontBodyProps {
  statuses: Record<string, BodyRegionStatus>;
  activeRegionId?: string;
  onRegionOpen: (selection: BodyRegionSelection) => void;
}

interface RegionDefinition {
  id: string;
  label: string;
  d: string;
  hitD?: string;
  markerX: number;
  markerY: number;
  glowRadius: number;
  labelOffsetX?: number;
  labelOffsetY?: number;
}

const FRONT_REGIONS: RegionDefinition[] = [
  {
    id: "front-head",
    label: "Head",
    d: "M151 18C134 40 131 75 134 112C138 164 160 207 228 219C296 207 318 164 322 112C325 75 322 40 305 18C278 7 178 7 151 18Z",
    markerX: 228,
    markerY: 112,
    glowRadius: 48,
  },
  {
    id: "front-chest",
    label: "Chest",
    d: "M165 263C134 271 101 282 80 309C63 332 59 374 65 430L80 515C107 548 151 564 228 564C305 564 349 548 376 515L391 430C397 374 393 332 376 309C355 282 322 271 291 263C271 286 251 297 228 297C205 297 185 286 165 263Z",
    hitD: "M151 276C121 278 91 291 73 319C57 345 58 385 64 428L79 513C111 547 157 562 228 562C299 562 345 547 377 513L392 428C398 385 399 345 383 319C365 291 335 278 305 276C281 302 255 314 228 314C201 314 175 302 151 276Z",
    markerX: 228,
    markerY: 414,
    glowRadius: 62,
  },
  {
    id: "front-abdomen",
    label: "Abdomen",
    d: "M104 520C125 548 146 574 151 618C155 654 146 700 137 750C164 769 193 778 228 778C263 778 292 769 319 750C310 700 301 654 305 618C310 574 331 548 352 520C318 548 279 564 228 564C177 564 138 548 104 520Z",
    hitD: "M91 503C116 537 137 570 142 619C146 658 137 707 124 760C153 785 187 797 228 797C269 797 303 785 332 760C319 707 310 658 314 619C319 570 340 537 365 503C324 540 279 557 228 557C177 557 132 540 91 503Z",
    markerX: 228,
    markerY: 600,
    glowRadius: 58,
  },
  {
    id: "front-pelvis",
    label: "Pelvis",
    d: "M137 730C125 775 111 824 112 872C138 901 171 916 204 918C215 918 222 899 228 881C234 899 241 918 252 918C285 916 318 901 344 872C345 824 331 775 319 730C295 760 264 778 228 778C192 778 161 760 137 730Z",
    markerX: 228,
    markerY: 725,
    glowRadius: 54,
  },
  {
    id: "front-right-upper-arm",
    label: "Right Upper Arm",
    d: "M79 292C53 309 41 341 41 391L44 491C48 535 55 574 64 608C76 621 94 624 111 613C121 582 126 552 126 521C125 474 116 433 108 392C101 350 92 318 79 292Z",
    markerX: 79,
    markerY: 456,
    glowRadius: 43,
    labelOffsetX: 32,
  },
  {
    id: "front-left-upper-arm",
    label: "Left Upper Arm",
    d: "M377 292C403 309 415 341 415 391L412 491C408 535 401 574 392 608C380 621 362 624 345 613C335 582 330 552 330 521C331 474 340 433 348 392C355 350 364 318 377 292Z",
    markerX: 377,
    markerY: 456,
    glowRadius: 43,
    labelOffsetX: -32,
  },
  {
    id: "front-right-forearm",
    label: "Right Forearm",
    d: "M64 590C54 641 45 691 38 741C32 784 31 818 35 852C44 875 58 885 74 887C91 889 102 878 106 859C108 830 108 806 112 778L127 666C130 642 124 622 111 608C94 624 77 620 64 590Z",
    hitD: "M55 583C43 636 33 690 26 739C19 786 19 827 25 863C36 887 53 899 73 900C96 901 113 886 118 861C120 831 120 807 124 780L139 667C143 633 134 610 112 592C95 611 76 609 55 583Z",
    markerX: 45,
    markerY: 700,
    glowRadius: 39,
    labelOffsetX: 39,
  },
  {
    id: "front-left-forearm",
    label: "Left Forearm",
    d: "M392 590C402 641 411 691 418 741C424 784 425 818 421 852C412 875 398 885 382 887C365 889 354 878 350 859C348 830 348 806 344 778L329 666C326 642 332 622 345 608C362 624 379 620 392 590Z",
    hitD: "M401 583C413 636 423 690 430 739C437 786 437 827 431 863C420 887 403 899 383 900C360 901 343 886 338 861C336 831 336 807 332 780L317 667C313 633 322 610 344 592C361 611 380 609 401 583Z",
    markerX: 415,
    markerY: 700,
    glowRadius: 39,
    labelOffsetX: -39,
  },
  {
    id: "front-right-thigh",
    label: "Right Thigh",
    d: "M112 855C131 889 144 929 151 973C158 1018 159 1065 156 1111C153 1151 146 1189 140 1225C157 1243 177 1248 198 1242C204 1195 210 1148 214 1098C218 1043 220 986 220 930C220 905 214 887 203 875C169 884 139 878 112 855Z",
    markerX: 172,
    markerY: 900,
    glowRadius: 56,
    labelOffsetX: 25,
  },
  {
    id: "front-left-thigh",
    label: "Left Thigh",
    d: "M344 855C325 889 312 929 305 973C298 1018 297 1065 300 1111C303 1151 310 1189 316 1225C299 1243 279 1248 258 1242C252 1195 246 1148 242 1098C238 1043 236 986 236 930C236 905 242 887 253 875C287 884 317 878 344 855Z",
    markerX: 284,
    markerY: 900,
    glowRadius: 56,
    labelOffsetX: -25,
  },
  {
    id: "front-right-lower-leg",
    label: "Right Lower Leg",
    d: "M140 1208C132 1259 124 1312 124 1368C124 1415 131 1457 139 1497C146 1526 146 1551 140 1573C153 1588 171 1592 189 1583C191 1546 190 1507 190 1470C191 1409 194 1348 198 1235C177 1244 157 1238 140 1208Z",
    markerX: 160,
    markerY: 1200,
    glowRadius: 45,
    labelOffsetX: 28,
  },
  {
    id: "front-left-lower-leg",
    label: "Left Lower Leg",
    d: "M316 1208C324 1259 332 1312 332 1368C332 1415 325 1457 317 1497C310 1526 310 1551 316 1573C303 1588 285 1592 267 1583C265 1546 266 1507 266 1470C265 1409 262 1348 258 1235C279 1244 299 1238 316 1208Z",
    markerX: 296,
    markerY: 1200,
    glowRadius: 45,
    labelOffsetX: -28,
  },

  {
    id: "front-neck",
    label: "Neck",
    d: "M165 184L165 271C181 288 203 297 228 297C253 297 275 288 291 271L291 184C276 207 253 220 228 220C203 220 180 207 165 184Z",
    hitD: "M174 181L174 273C188 286 206 293 228 293C250 293 268 286 282 273L282 181C267 205 250 217 228 217C206 217 189 205 174 181Z",
    markerX: 228,
    markerY: 245,
    glowRadius: 34,
  },
  {
    id: "front-right-hand",
    label: "Right Hand",
    d: "M35 837C28 873 30 909 39 940C48 970 68 991 94 1000C108 1005 117 994 112 981C104 955 100 925 106 858C101 877 90 888 75 888C58 887 44 875 35 837Z",
    hitD: "M20 826C11 869 13 914 25 952C37 989 60 1016 91 1027C116 1036 132 1020 124 995C115 964 112 925 119 847C108 882 91 901 73 901C49 901 31 877 20 826Z",
    markerX: 45,
    markerY: 825,
    glowRadius: 34,
    labelOffsetX: 42,
  },
  {
    id: "front-left-hand",
    label: "Left Hand",
    d: "M421 837C428 873 426 909 417 940C408 970 388 991 362 1000C348 1005 339 994 344 981C352 955 356 925 350 858C355 877 366 888 381 888C398 887 412 875 421 837Z",
    hitD: "M436 826C445 869 443 914 431 952C419 989 396 1016 365 1027C340 1036 324 1020 332 995C341 964 344 925 337 847C348 882 365 901 383 901C407 901 425 877 436 826Z",
    markerX: 415,
    markerY: 825,
    glowRadius: 34,
    labelOffsetX: -42,
  },
  {
    id: "front-right-foot",
    label: "Right Foot",
    d: "M139 1554C126 1573 119 1598 120 1635H196C197 1615 194 1594 189 1574C172 1592 151 1591 139 1554Z",
    hitD: "M117 1539C99 1568 94 1603 96 1635H220C221 1604 215 1574 205 1548C181 1597 146 1601 117 1539Z",
    markerX: 170,
    markerY: 1550,
    glowRadius: 31,
    labelOffsetX: 25,
    labelOffsetY: -39,
  },
  {
    id: "front-left-foot",
    label: "Left Foot",
    d: "M317 1554C330 1573 337 1598 336 1635H260C259 1615 262 1594 267 1574C284 1592 305 1591 317 1554Z",
    hitD: "M339 1539C357 1568 362 1603 360 1635H236C235 1604 241 1574 251 1548C275 1597 310 1601 339 1539Z",
    markerX: 290,
    markerY: 1550,
    glowRadius: 31,
    labelOffsetX: -25,
    labelOffsetY: -39,
  },
];

export default function FrontBody({
  statuses,
  activeRegionId,
  onRegionOpen,
}: FrontBodyProps) {
  return (
    <div className="body-figure">
      <h4 className="body-figure-title">Front</h4>

      <svg
        className="body-figure-svg"
        viewBox="0 0 456 1635"
        role="img"
        aria-label="Front body map"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient
            id="frontBodyGradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#eef6ff" />
            <stop offset="55%" stopColor="#cfe3fa" />
            <stop offset="100%" stopColor="#a9c9ed" />
          </linearGradient>

          <filter
            id="frontBodyShadow"
            x="-25%"
            y="-25%"
            width="150%"
            height="150%"
          >
            <feDropShadow
              dx="0"
              dy="7"
              stdDeviation="9"
              floodColor="#1f3654"
              floodOpacity="0.17"
            />
          </filter>

          <mask
            id="frontBodyMask"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="456"
            height="1635"
          >
            <image
              href={frontBodyMask}
              x="0"
              y="0"
              width="456"
              height="1635"
              preserveAspectRatio="none"
            />
          </mask>
        </defs>

        <rect
          className="body-figure-base"
          x="0"
          y="0"
          width="456"
          height="1635"
          fill="url(#frontBodyGradient)"
          filter="url(#frontBodyShadow)"
          mask="url(#frontBodyMask)"
        />

      {FRONT_REGIONS.map((region) => (
  <BodyRegion
    key={region.id}
    {...region}
    status={statuses[region.id]}
    isActive={activeRegionId === region.id}
    onOpen={onRegionOpen}
  />
))}

        <image
          className="body-figure-line-art"
          href={frontBodyLineArt}
          x="0"
          y="0"
          width="456"
          height="1635"
          preserveAspectRatio="none"
          pointerEvents="none"
          aria-hidden="true"
        />
      </svg>
    </div>
  );
}