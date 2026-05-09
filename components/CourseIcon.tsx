function isImageIcon(icon: string): boolean {
  return /^(https?:\/\/|\/|data:image\/)/.test(icon);
}

export default function CourseIcon({
  icon,
  title,
  className = 'course-icon',
  style,
  dataColor,
}: {
  icon: string;
  title: string;
  className?: string;
  style?: CSSProperties;
  dataColor?: string;
}) {
  if (isImageIcon(icon)) {
    return (
      <div className={className} style={style} data-color={dataColor}>
        <img src={icon} alt="" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={className} style={style} data-color={dataColor} aria-label={title}>
      {icon}
    </div>
  );
}
import type { CSSProperties } from 'react';
