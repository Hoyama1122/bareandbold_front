import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#6B7A4E",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          color: "white",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
            stroke="white"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <path
            d="M8.5 12C8.5 13.933 10.067 15.5 12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12Z"
            fill="white"
          />
          <path
            d="M12 5C8.134 5 5 8.134 5 12C5 15.866 8.134 19 12 19C15.866 19 19 15.866 19 12C19 8.134 15.866 5 12 5Z"
            stroke="white"
            strokeWidth="1.8"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
