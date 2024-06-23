// import { useSession } from 'next-auth/react';
import ProfileForm from './profile-form';
import classes from './user-profile.module.css';

function UserProfile() {
  // const { data: session, status } = useSession();
  // const loading = status === 'loading';

  // if (loading) {
  //   return <p className={classes.profile}>Loading...</p>;
  // } else {
  //   if (!session) {
  //     window.location.href = '/auth';
  //   } else {
      return (
        <section className={classes.profile}>
          <h1>Your User Profile</h1>
          <ProfileForm />
        </section>
      );
  //   }
  // }
}

export default UserProfile;
