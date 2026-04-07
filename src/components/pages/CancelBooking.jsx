import React from 'react';

function CancelBooking() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f4f4f4',
      padding: '20px'
    }}>
      <h1 style={{ color: '#333' }}>Cancel Booking</h1>
      <p style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        Are you sure you want to cancel your booking? Please note that depending on our cancellation policy, you may be charged a fee. Please refer to our terms and conditions for details.
      </p>
      <button style={{
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#d9534f',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
      }}>
        Cancel Booking
      </button>
    </div>
  );
}

export default CancelBooking;