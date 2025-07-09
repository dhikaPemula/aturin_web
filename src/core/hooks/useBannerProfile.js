import { useEffect, useState } from 'react';
import { getBannerProfile } from '../services/api/profile_api_service';

// Inisialisasi token langsung dari localStorage
const TOKEN = localStorage.getItem('token');

export default function useBannerProfile() {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getBannerProfile(TOKEN)
      .then((res) => {
        setBanner(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { banner, loading, error };
}
