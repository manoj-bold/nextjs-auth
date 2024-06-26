import classes from './profile-form.module.css';
import { useFlashMessage } from '../../hooks/flash-message';

function ProfileForm() {
  const { setFlashMessage } = useFlashMessage();

  async function handleChangePassword(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const newPassword = formData.get('new-password');
    const oldPassword = formData.get('old-password');

    if (!oldPassword || oldPassword.length < 6) {
      setFlashMessage('Old password must be at least 6 characters long.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setFlashMessage('New password must be at least 6 characters long.');
      return;
    }

    const response = await fetch('/api/user/change-password', {
      method: 'PATCH',
      body: JSON.stringify({ newPassword, oldPassword }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      setFlashMessage(data.message || 'Password update failed!');
    } else {
      setFlashMessage(data.message);
    }
  }

  return (
    <form className={classes.form} onSubmit={handleChangePassword}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' name='new-password' />
      </div>
      <div className={classes.control}>
        <label htmlFor='old-password'>Old Password</label>
        <input type='password' name='old-password' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
