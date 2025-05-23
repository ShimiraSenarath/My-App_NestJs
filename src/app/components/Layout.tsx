import NavigationDrawer from './NavigationDrawer';
import styles from './Layout.module.scss';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <NavigationDrawer />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
