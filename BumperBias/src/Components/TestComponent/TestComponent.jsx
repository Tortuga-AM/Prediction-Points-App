// src/Components/TestComponent/TestComponent.jsx
import React from 'react';
import styles from './TestComponent.module.css';

function TestComponent() {
    return (
        <div className={styles.container}>
            <p className={styles.text}>
                This is a test component to verify that CSS modules are working correctly.
            </p>
            <button className={styles.button}>
                Click Me
            </button>
        </div>
    );
}
export default TestComponent;