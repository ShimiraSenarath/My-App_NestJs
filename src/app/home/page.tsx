import NavigationDrawer from '../components/NavigationDrawer';
import styles from './page.module.scss';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <NavigationDrawer />
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Welcome to My App</h1>
      </main>
    </div>
  );
}
