import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from './firebase';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

function App() {
  const [dataPoints, setDataPoints] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const tempRef = ref(database, 'DHT11/temperature');
    const humRef = ref(database, 'DHT11/humidity');
    const imagesRef = ref(database, 'images');

    let currentTemp = null;
    let currentHum = null;

    const updateData = () => {
      if (currentTemp !== null && currentHum !== null) {
        const now = new Date();
        const timeLabel = now.toLocaleTimeString();

        setDataPoints((prev) => {
          const newData = [...prev, { time: timeLabel, temperature: currentTemp, humidity: currentHum }];
          if (newData.length > 20) newData.shift(); // max 20 points
          return newData;
        });
      }
    };

    const unsubscribeTemp = onValue(tempRef, (snapshot) => {
      const temp = snapshot.val();
      if (temp !== null) {
        currentTemp = parseFloat(temp);
        updateData();
      }
    });

    const unsubscribeHum = onValue(humRef, (snapshot) => {
      const hum = snapshot.val();
      if (hum !== null) {
        currentHum = parseFloat(hum);
        updateData();
      }
    });

    const unsubscribeImg = onValue(imagesRef, (snapshot) => {
      const imgs = snapshot.val();
      if (imgs !== null) {
        const firstImageUrl = Object.values(imgs)[0]?.url;
        setImage(firstImageUrl);
      }
    });

    return () => {
      unsubscribeTemp();
      unsubscribeHum();
      unsubscribeImg();
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Surveillance en temps réel</h1>

      {/* Température */}
      <div style={styles.chartSection}>
        <h2 style={styles.subHeader}>Température (°C)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dataPoints} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="temperature" stroke="#ff7300" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Humidité */}
      <div style={styles.chartSection}>
        <h2 style={styles.subHeader}>Humidité (%)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dataPoints} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="humidity" stroke="#387908" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Image */}
      <div style={styles.imageContainer}>
        <h2 style={styles.subHeader}>Image en temps réel</h2>
        {image ? (
          <img src={image} alt="Visualisation capteurs" style={styles.image} />
        ) : (
          <p style={styles.loadingText}>Chargement de l'image...</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f0f0',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: '40px auto',
  },
  header: {
    fontSize: '2.5rem',
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
  },
  subHeader: {
    fontSize: '1.5rem',
    color: '#444',
    marginBottom: '10px',
    textAlign: 'left',
  },
  chartSection: {
    marginBottom: '40px',
  },
  imageContainer: {
    textAlign: 'center',
    marginTop: '20px',
  },
  image: {
    width: '100%',
    maxWidth: '600px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease-in-out',
  },
  loadingText: {
    fontSize: '1.2rem',
    color: '#888',
  },
};

export default App;
