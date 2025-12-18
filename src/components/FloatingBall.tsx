import { useState } from 'react';

interface FloatingBallProps {
  qrCodeImage: string;
  tooltipText: string;
}

export function FloatingBall({ qrCodeImage, tooltipText }: FloatingBallProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div
        className="floating-ball"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        aria-label="显示微信交流群二维码"
        tabIndex={0}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
      >
        <span className="icon">💬</span>
        <span className="text">交流群</span>
      </div>
      {isHovered && (
        <div className="qr-popup">
          <img src={qrCodeImage} alt="微信交流群二维码" />
          <p>{tooltipText}</p>
        </div>
      )}
    </>
  );
}
