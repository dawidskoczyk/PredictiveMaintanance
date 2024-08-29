import React from 'react';
import { Link } from 'react-router-dom';
export function History() {
  return (
    <div>
      <h1> History Page</h1>
      <Link to="/home">
      <button>Home</button>
    </Link>
    </div>
  );
}

