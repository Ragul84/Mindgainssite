// One real external asset: the MIGA mascot sprite (cut out from the brand photo), used as a
// texture composited into in-world signage — trackside billboards and sponsor boards — the
// way a real mascot shows up organically on real racetrack signage, not as a UI sticker.
export let migaImg = null;

export function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export async function preloadMiga() {
  try {
    migaImg = await preloadImage('assets/miga-sprite.png');
  } catch (err) {
    console.warn('[assets] MIGA sprite failed to load, signage will render without it', err);
  }
  return migaImg;
}
