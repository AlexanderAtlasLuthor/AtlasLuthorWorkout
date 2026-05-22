// Nutrition helpers: calorie/macro math plus a built-in offline food database.

const LB_PER_KG = 2.2046226218;
const IN_PER_CM = 0.393700787;

export const MEALS = ["breakfast", "lunch", "dinner", "snack"];

export const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

export const ACTIVITY_LEVELS = ["sedentary", "light", "moderate", "active", "athlete"];

// Mifflin-St Jeor basal metabolic rate. heightInches, weightLb, age years.
export function calcBMR({ weightLb, heightInches, age, sex }) {
  const kg = (Number(weightLb) || 0) / LB_PER_KG;
  const cm = (Number(heightInches) || 0) / IN_PER_CM;
  const years = Number(age) || 25;
  if (!kg || !cm) return 0;
  const base = 10 * kg + 6.25 * cm - 5 * years;
  return Math.round(base + (sex === "female" ? -161 : 5));
}

// Total daily energy expenditure from BMR and an activity level.
export function calcTDEE(bmr, activityLevel) {
  const factor = ACTIVITY_FACTORS[activityLevel] || ACTIVITY_FACTORS.moderate;
  return Math.round((Number(bmr) || 0) * factor);
}

// Goal-adjusted daily calorie target.
export function goalCalorieTarget(tdee, bodyTypeGoal) {
  const total = Number(tdee) || 0;
  if (!total) return 0;
  if (bodyTypeGoal === "lean") return total - 400;
  if (bodyTypeGoal === "muscular") return total + 350;
  if (bodyTypeGoal === "athletic") return total - 150;
  return total;
}

// Daily macro targets (grams) from a calorie target. 4/4/9 kcal per gram.
export function macroSplit(calories, bodyTypeGoal) {
  const total = Number(calories) || 0;
  let proteinPct;
  let fatPct;
  if (bodyTypeGoal === "lean") { proteinPct = 0.40; fatPct = 0.30; }
  else if (bodyTypeGoal === "muscular") { proteinPct = 0.30; fatPct = 0.25; }
  else { proteinPct = 0.35; fatPct = 0.28; }
  const carbPct = 1 - proteinPct - fatPct;
  return {
    protein: Math.round((total * proteinPct) / 4),
    carbs: Math.round((total * carbPct) / 4),
    fat: Math.round((total * fatPct) / 9),
  };
}

// Sums a single day's food log into calorie/macro totals.
export function sumDayMacros(dayLog) {
  const totals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  if (!dayLog) return totals;
  MEALS.forEach(meal => {
    (dayLog[meal] || []).forEach(item => {
      const qty = Number(item.qty) || 1;
      totals.kcal += (Number(item.kcal) || 0) * qty;
      totals.protein += (Number(item.protein) || 0) * qty;
      totals.carbs += (Number(item.carbs) || 0) * qty;
      totals.fat += (Number(item.fat) || 0) * qty;
    });
  });
  return {
    kcal: Math.round(totals.kcal),
    protein: Math.round(totals.protein),
    carbs: Math.round(totals.carbs),
    fat: Math.round(totals.fat),
  };
}

// Built-in food database. Macros are per the listed serving.
export const FOOD_DB = [
  { id: "chicken-breast", en: "Chicken Breast", es: "Pechuga de Pollo", serving: "100 g", cat: "protein", kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: "chicken-thigh", en: "Chicken Thigh", es: "Muslo de Pollo", serving: "100 g", cat: "protein", kcal: 209, protein: 26, carbs: 0, fat: 11 },
  { id: "ground-beef", en: "Ground Beef (lean)", es: "Carne Molida (magra)", serving: "100 g", cat: "protein", kcal: 176, protein: 20, carbs: 0, fat: 10 },
  { id: "steak", en: "Sirloin Steak", es: "Bistec de Res", serving: "100 g", cat: "protein", kcal: 206, protein: 27, carbs: 0, fat: 10 },
  { id: "salmon", en: "Salmon", es: "Salmón", serving: "100 g", cat: "protein", kcal: 208, protein: 20, carbs: 0, fat: 13 },
  { id: "tuna", en: "Canned Tuna", es: "Atún en Lata", serving: "100 g", cat: "protein", kcal: 116, protein: 26, carbs: 0, fat: 1 },
  { id: "tilapia", en: "Tilapia", es: "Tilapia", serving: "100 g", cat: "protein", kcal: 128, protein: 26, carbs: 0, fat: 3 },
  { id: "shrimp", en: "Shrimp", es: "Camarón", serving: "100 g", cat: "protein", kcal: 99, protein: 24, carbs: 0, fat: 0.3 },
  { id: "pork-chop", en: "Pork Chop", es: "Chuleta de Cerdo", serving: "100 g", cat: "protein", kcal: 231, protein: 26, carbs: 0, fat: 14 },
  { id: "turkey-breast", en: "Turkey Breast", es: "Pechuga de Pavo", serving: "100 g", cat: "protein", kcal: 135, protein: 30, carbs: 0, fat: 1 },
  { id: "egg", en: "Egg (large)", es: "Huevo (grande)", serving: "1 egg", cat: "protein", kcal: 72, protein: 6, carbs: 0.4, fat: 5 },
  { id: "egg-whites", en: "Egg Whites", es: "Claras de Huevo", serving: "1 cup", cat: "protein", kcal: 117, protein: 26, carbs: 2, fat: 0 },
  { id: "whey", en: "Whey Protein", es: "Proteína Whey", serving: "1 scoop", cat: "protein", kcal: 120, protein: 24, carbs: 3, fat: 1.5 },
  { id: "greek-yogurt", en: "Greek Yogurt (plain)", es: "Yogur Griego (natural)", serving: "170 g", cat: "dairy", kcal: 100, protein: 17, carbs: 6, fat: 0.7 },
  { id: "cottage-cheese", en: "Cottage Cheese", es: "Requesón", serving: "1/2 cup", cat: "dairy", kcal: 110, protein: 12, carbs: 5, fat: 5 },
  { id: "tofu", en: "Tofu", es: "Tofu", serving: "100 g", cat: "protein", kcal: 76, protein: 8, carbs: 2, fat: 4.8 },
  { id: "black-beans", en: "Black Beans", es: "Frijoles Negros", serving: "1 cup", cat: "protein", kcal: 227, protein: 15, carbs: 41, fat: 0.9 },
  { id: "lentils", en: "Lentils", es: "Lentejas", serving: "1 cup", cat: "protein", kcal: 230, protein: 18, carbs: 40, fat: 0.8 },
  { id: "chickpeas", en: "Chickpeas", es: "Garbanzos", serving: "1 cup", cat: "protein", kcal: 269, protein: 15, carbs: 45, fat: 4 },
  { id: "white-rice", en: "White Rice", es: "Arroz Blanco", serving: "1 cup", cat: "carb", kcal: 205, protein: 4, carbs: 45, fat: 0.4 },
  { id: "brown-rice", en: "Brown Rice", es: "Arroz Integral", serving: "1 cup", cat: "carb", kcal: 218, protein: 5, carbs: 46, fat: 1.6 },
  { id: "oatmeal", en: "Oatmeal", es: "Avena", serving: "1 cup", cat: "carb", kcal: 154, protein: 6, carbs: 27, fat: 3 },
  { id: "pasta", en: "Pasta", es: "Pasta", serving: "1 cup", cat: "carb", kcal: 220, protein: 8, carbs: 43, fat: 1.3 },
  { id: "bread", en: "Whole Wheat Bread", es: "Pan Integral", serving: "1 slice", cat: "carb", kcal: 80, protein: 4, carbs: 14, fat: 1 },
  { id: "bagel", en: "Bagel", es: "Bagel", serving: "1 bagel", cat: "carb", kcal: 245, protein: 10, carbs: 48, fat: 1.5 },
  { id: "sweet-potato", en: "Sweet Potato", es: "Camote", serving: "1 medium", cat: "carb", kcal: 112, protein: 2, carbs: 26, fat: 0.1 },
  { id: "potato", en: "Baked Potato", es: "Papa al Horno", serving: "1 medium", cat: "carb", kcal: 161, protein: 4, carbs: 37, fat: 0.2 },
  { id: "quinoa", en: "Quinoa", es: "Quinoa", serving: "1 cup", cat: "carb", kcal: 222, protein: 8, carbs: 39, fat: 3.6 },
  { id: "tortilla", en: "Flour Tortilla", es: "Tortilla de Harina", serving: "1 tortilla", cat: "carb", kcal: 140, protein: 4, carbs: 23, fat: 4 },
  { id: "cereal", en: "Cereal", es: "Cereal", serving: "1 cup", cat: "carb", kcal: 150, protein: 3, carbs: 32, fat: 2 },
  { id: "pancake", en: "Pancake", es: "Panqueque", serving: "1 pancake", cat: "carb", kcal: 90, protein: 2, carbs: 11, fat: 4 },
  { id: "banana", en: "Banana", es: "Plátano", serving: "1 medium", cat: "fruit", kcal: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { id: "apple", en: "Apple", es: "Manzana", serving: "1 medium", cat: "fruit", kcal: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { id: "orange", en: "Orange", es: "Naranja", serving: "1 medium", cat: "fruit", kcal: 62, protein: 1.2, carbs: 15, fat: 0.2 },
  { id: "strawberries", en: "Strawberries", es: "Fresas", serving: "1 cup", cat: "fruit", kcal: 49, protein: 1, carbs: 12, fat: 0.5 },
  { id: "blueberries", en: "Blueberries", es: "Arándanos", serving: "1 cup", cat: "fruit", kcal: 84, protein: 1.1, carbs: 21, fat: 0.5 },
  { id: "grapes", en: "Grapes", es: "Uvas", serving: "1 cup", cat: "fruit", kcal: 104, protein: 1.1, carbs: 27, fat: 0.2 },
  { id: "avocado", en: "Avocado", es: "Aguacate", serving: "1/2 fruit", cat: "fat", kcal: 120, protein: 1.5, carbs: 6, fat: 11 },
  { id: "mango", en: "Mango", es: "Mango", serving: "1 cup", cat: "fruit", kcal: 99, protein: 1.4, carbs: 25, fat: 0.6 },
  { id: "pineapple", en: "Pineapple", es: "Piña", serving: "1 cup", cat: "fruit", kcal: 82, protein: 0.9, carbs: 22, fat: 0.2 },
  { id: "watermelon", en: "Watermelon", es: "Sandía", serving: "1 cup", cat: "fruit", kcal: 46, protein: 0.9, carbs: 12, fat: 0.2 },
  { id: "broccoli", en: "Broccoli", es: "Brócoli", serving: "1 cup", cat: "veg", kcal: 55, protein: 3.7, carbs: 11, fat: 0.6 },
  { id: "spinach", en: "Spinach", es: "Espinaca", serving: "1 cup", cat: "veg", kcal: 7, protein: 0.9, carbs: 1.1, fat: 0.1 },
  { id: "salad", en: "Mixed Salad", es: "Ensalada Mixta", serving: "2 cups", cat: "veg", kcal: 20, protein: 1.5, carbs: 4, fat: 0.2 },
  { id: "carrots", en: "Carrots", es: "Zanahorias", serving: "1 cup", cat: "veg", kcal: 52, protein: 1.2, carbs: 12, fat: 0.3 },
  { id: "green-beans", en: "Green Beans", es: "Ejotes", serving: "1 cup", cat: "veg", kcal: 31, protein: 1.8, carbs: 7, fat: 0.2 },
  { id: "bell-pepper", en: "Bell Pepper", es: "Pimiento", serving: "1 pepper", cat: "veg", kcal: 31, protein: 1, carbs: 6, fat: 0.3 },
  { id: "tomato", en: "Tomato", es: "Tomate", serving: "1 medium", cat: "veg", kcal: 22, protein: 1.1, carbs: 4.8, fat: 0.2 },
  { id: "corn", en: "Corn", es: "Elote", serving: "1 cup", cat: "veg", kcal: 132, protein: 5, carbs: 29, fat: 1.8 },
  { id: "asparagus", en: "Asparagus", es: "Espárragos", serving: "1 cup", cat: "veg", kcal: 27, protein: 3, carbs: 5, fat: 0.2 },
  { id: "milk", en: "Milk (2%)", es: "Leche (2%)", serving: "1 cup", cat: "dairy", kcal: 122, protein: 8, carbs: 12, fat: 5 },
  { id: "almond-milk", en: "Almond Milk", es: "Leche de Almendra", serving: "1 cup", cat: "dairy", kcal: 30, protein: 1, carbs: 1, fat: 2.5 },
  { id: "cheddar", en: "Cheddar Cheese", es: "Queso Cheddar", serving: "1 slice", cat: "dairy", kcal: 113, protein: 7, carbs: 0.4, fat: 9 },
  { id: "butter", en: "Butter", es: "Mantequilla", serving: "1 tbsp", cat: "fat", kcal: 102, protein: 0.1, carbs: 0, fat: 11.5 },
  { id: "olive-oil", en: "Olive Oil", es: "Aceite de Oliva", serving: "1 tbsp", cat: "fat", kcal: 119, protein: 0, carbs: 0, fat: 13.5 },
  { id: "peanut-butter", en: "Peanut Butter", es: "Crema de Cacahuate", serving: "2 tbsp", cat: "fat", kcal: 188, protein: 8, carbs: 6, fat: 16 },
  { id: "almonds", en: "Almonds", es: "Almendras", serving: "1 oz", cat: "fat", kcal: 164, protein: 6, carbs: 6, fat: 14 },
  { id: "walnuts", en: "Walnuts", es: "Nueces", serving: "1 oz", cat: "fat", kcal: 185, protein: 4, carbs: 4, fat: 18.5 },
  { id: "protein-bar", en: "Protein Bar", es: "Barra de Proteína", serving: "1 bar", cat: "snack", kcal: 200, protein: 20, carbs: 22, fat: 7 },
  { id: "dark-chocolate", en: "Dark Chocolate", es: "Chocolate Oscuro", serving: "1 oz", cat: "snack", kcal: 170, protein: 2, carbs: 13, fat: 12 },
  { id: "chips", en: "Potato Chips", es: "Papas Fritas (bolsa)", serving: "1 oz", cat: "snack", kcal: 152, protein: 2, carbs: 15, fat: 10 },
  { id: "burger", en: "Hamburger", es: "Hamburguesa", serving: "1 burger", cat: "snack", kcal: 354, protein: 20, carbs: 31, fat: 17 },
  { id: "pizza", en: "Pizza Slice", es: "Rebanada de Pizza", serving: "1 slice", cat: "snack", kcal: 285, protein: 12, carbs: 36, fat: 10 },
  { id: "fries", en: "French Fries", es: "Papas a la Francesa", serving: "1 medium", cat: "snack", kcal: 365, protein: 4, carbs: 48, fat: 17 },
  { id: "honey", en: "Honey", es: "Miel", serving: "1 tbsp", cat: "snack", kcal: 64, protein: 0, carbs: 17, fat: 0 },
  { id: "coffee", en: "Black Coffee", es: "Café Negro", serving: "1 cup", cat: "drink", kcal: 2, protein: 0.3, carbs: 0, fat: 0 },
  { id: "orange-juice", en: "Orange Juice", es: "Jugo de Naranja", serving: "1 cup", cat: "drink", kcal: 112, protein: 1.7, carbs: 26, fat: 0.5 },
  { id: "soda", en: "Soda", es: "Refresco", serving: "1 can", cat: "drink", kcal: 140, protein: 0, carbs: 39, fat: 0 },
  { id: "sushi-roll", en: "Sushi Roll", es: "Rollo de Sushi", serving: "6 pieces", cat: "snack", kcal: 200, protein: 9, carbs: 38, fat: 3 },
  { id: "chicken-salad", en: "Chicken Caesar Salad", es: "Ensalada César con Pollo", serving: "1 bowl", cat: "snack", kcal: 470, protein: 33, carbs: 12, fat: 32 },
];
