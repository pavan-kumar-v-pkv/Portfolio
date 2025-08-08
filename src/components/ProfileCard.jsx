import React, { useState } from 'react';

export default function ProfileCard() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      width: '100%', 
      height: '100%', 
      minHeight: '400px',
      background: 'transparent',
      position: 'relative',
      padding: '20px'
    }}>
      {/* Simple Interactive Card */}
      <div 
        style={{
          width: 'min(300px, 90vw)',
          height: 'min(400px, 80vh)',
          maxWidth: '300px',
          maxHeight: '400px',
          background: 'linear-gradient(145deg, #21262d 0%, #161b22 100%)',
          borderRadius: '16px',
          border: `2px solid ${isHovered ? '#58a6ff' : '#30363d'}`,
          boxShadow: isHovered 
            ? '0 8px 16px rgba(88, 166, 255, 0.2)' 
            : '0 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsClicked(false);
        }}
        onMouseDown={() => setIsClicked(true)}
        onMouseUp={() => setIsClicked(false)}
      >
        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(88, 166, 255, 0.1) 0%, transparent 50%)',
          borderRadius: '14px',
          opacity: isHovered ? 1 : 0.3,
          transition: 'opacity 0.3s ease'
        }} />

        {/* Profile Image Section */}
        <div style={{
          flex: '0 0 250px',
          padding: '20px 20px 10px 20px',
          position: 'relative'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
            border: '2px solid #30363d'
          }}>
            <img 
              src="/profile-image.jpeg"
              alt="Pavan Kumar V"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            
            {/* Fallback placeholder */}
            <div style={{
              display: 'none',
              width: '100%',
              height: '100%',
              backgroundColor: '#21262d',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              color: '#58a6ff',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>👤</div>
              <div>Profile Image</div>
            </div>
          </div>

          {/* Status indicator */}
          {/* <div style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            width: '12px',
            height: '12px',
            backgroundColor: '#00d084',
            borderRadius: '50%',
            border: '2px solid #21262d',
            boxShadow: '0 0 8px rgba(0, 208, 132, 0.5)'
          }} /> */}
        </div>

        {/* Info Section */}
        <div style={{
          flex: 1,
          padding: '10px 20px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          <h2 style={{
            margin: '0 0 8px 0',
            color: '#c9d1d9',
            fontSize: '24px',
            fontWeight: '600',
            textAlign: 'center',
            fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
          }}>
            Pavan Kumar V
          </h2>
          
          <p style={{
            margin: '0 0 12px 0',
            color: '#58a6ff',
            fontSize: '16px',
            fontWeight: '500',
            textAlign: 'center',
            fontFamily: 'inherit'
          }}>
            Software Engineer
          </p>
        </div>

        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '40px',
          height: '40px',
          background: 'linear-gradient(45deg, rgba(88, 166, 255, 0.1), transparent)',
          borderRadius: '50%'
        }} />
      </div>
    </div>
  );
}