import React from 'react';

export default function DStatusLoader({ label, fullScreen = false, speedMs = 1200 }) {
  const Wrapper = fullScreen ? 'div' : React.Fragment;
  const wrapperProps = fullScreen
    ? { className: 'flex min-h-[55vh] items-center justify-center' }
    : {};

  return (
    <Wrapper {...wrapperProps}>
      <div className="d-loader-wrap" style={{ '--d-loader-speed': `${speedMs}ms` }}>
        <div className="d-loader-ring" />
        <div className="d-loader-glyph">D</div>
        {label ? <p className="d-loader-label">{label}</p> : null}
      </div>
    </Wrapper>
  );
}
