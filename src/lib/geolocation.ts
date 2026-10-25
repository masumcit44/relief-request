// src/lib/geolocation.ts [M1]
export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy: number;
}

export async function getPosition(): Promise<GeoPosition> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser / আপনার ব্রাউজারে লোকেশন সমর্থন করে না।'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      error => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location permission denied. Please allow location access. / লোকেশন অনুমতি দেওয়া হয়নি। অনুগ্রহ করে লোকেশন পারমিশন দিন।'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information is unavailable. / লোকেশন পাওয়া যায়নি। জিপিএস চালু আছে কিনা দেখুন।'));
            break;
          case error.TIMEOUT:
            reject(new Error('Location request timed out. Please retry. / লোকেশন অনুরোধে সময় শেষ হয়ে গেছে। আবার চেষ্টা করুন।'));
            break;
          default:
            reject(new Error('An unknown error occurred while obtaining location. / লোকেশন পেতে সমস্যা হয়েছে।'));
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

