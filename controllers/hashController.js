import bcrypt from 'bcrypt';

// Fonction pour hacher un mot de passe
export async function hashPassword(password) {
  try {
    const saltRounds = 10; // Le nombre de "salts" à utiliser pour le hachage
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}

// Fonction pour vérifier si un mot de passe correspond au haché stocké
export async function checkPassword(password, hashedPassword) {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw error;
  }
}