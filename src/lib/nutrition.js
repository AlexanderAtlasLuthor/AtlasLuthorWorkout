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

  { id: "chicken-leg", en: "Chicken Leg", es: "Pierna de Pollo", serving: "100 g", cat: "protein", kcal: 191, protein: 27, carbs: 0, fat: 9 },
  { id: "roast-chicken", en: "Roast Chicken", es: "Pollo Asado", serving: "100 g", cat: "protein", kcal: 190, protein: 29, carbs: 0, fat: 8 },
  { id: "carnitas", en: "Carnitas", es: "Carnitas", serving: "100 g", cat: "protein", kcal: 250, protein: 22, carbs: 0, fat: 18 },
  { id: "carne-asada", en: "Carne Asada", es: "Carne Asada", serving: "100 g", cat: "protein", kcal: 220, protein: 26, carbs: 0, fat: 12 },
  { id: "chorizo", en: "Chorizo (Mexican)", es: "Chorizo Mexicano", serving: "60 g", cat: "protein", kcal: 273, protein: 14, carbs: 1, fat: 23 },
  { id: "picadillo", en: "Picadillo", es: "Picadillo", serving: "1 cup", cat: "protein", kcal: 280, protein: 22, carbs: 12, fat: 16 },
  { id: "ham-sliced", en: "Ham (sliced)", es: "Jamón en Tajadas", serving: "2 slices", cat: "protein", kcal: 90, protein: 12, carbs: 1, fat: 4 },
  { id: "bacon", en: "Bacon", es: "Tocino", serving: "2 slices", cat: "protein", kcal: 86, protein: 6, carbs: 0, fat: 7 },
  { id: "sausage", en: "Sausage", es: "Salchicha", serving: "1 link", cat: "protein", kcal: 170, protein: 9, carbs: 1, fat: 14 },
  { id: "deli-turkey", en: "Sliced Turkey", es: "Pavo en Tajadas", serving: "2 slices", cat: "protein", kcal: 60, protein: 11, carbs: 1, fat: 1 },
  { id: "sardines", en: "Sardines", es: "Sardinas", serving: "1 can", cat: "protein", kcal: 191, protein: 23, carbs: 0, fat: 11 },
  { id: "cod", en: "Cod", es: "Bacalao", serving: "100 g", cat: "protein", kcal: 105, protein: 23, carbs: 0, fat: 1 },
  { id: "crab", en: "Crab", es: "Cangrejo", serving: "100 g", cat: "protein", kcal: 87, protein: 18, carbs: 0, fat: 1 },
  { id: "pinto-beans", en: "Pinto Beans", es: "Frijoles Pintos", serving: "1 cup", cat: "protein", kcal: 245, protein: 15, carbs: 45, fat: 1 },
  { id: "refried-beans", en: "Refried Beans", es: "Frijoles Refritos", serving: "1 cup", cat: "protein", kcal: 217, protein: 14, carbs: 36, fat: 3 },

  { id: "whole-milk", en: "Whole Milk", es: "Leche Entera", serving: "1 cup", cat: "dairy", kcal: 149, protein: 8, carbs: 12, fat: 8 },
  { id: "skim-milk", en: "Skim Milk", es: "Leche Descremada", serving: "1 cup", cat: "dairy", kcal: 83, protein: 8, carbs: 12, fat: 0.2 },
  { id: "queso-fresco", en: "Queso Fresco", es: "Queso Fresco", serving: "30 g", cat: "dairy", kcal: 91, protein: 6, carbs: 1, fat: 7 },
  { id: "queso-oaxaca", en: "Queso Oaxaca", es: "Queso Oaxaca", serving: "30 g", cat: "dairy", kcal: 105, protein: 7, carbs: 1, fat: 8 },
  { id: "crema-mexicana", en: "Mexican Crema", es: "Crema Mexicana", serving: "2 tbsp", cat: "dairy", kcal: 100, protein: 1, carbs: 2, fat: 10 },
  { id: "mozzarella", en: "Mozzarella", es: "Mozzarella", serving: "30 g", cat: "dairy", kcal: 85, protein: 6, carbs: 1, fat: 6 },
  { id: "sour-cream", en: "Sour Cream", es: "Crema Agria", serving: "2 tbsp", cat: "dairy", kcal: 60, protein: 1, carbs: 1, fat: 6 },
  { id: "plain-yogurt", en: "Plain Yogurt", es: "Yogur Natural", serving: "1 cup", cat: "dairy", kcal: 149, protein: 8, carbs: 11, fat: 8 },

  { id: "corn-tortilla", en: "Corn Tortilla", es: "Tortilla de Maíz", serving: "1 tortilla", cat: "carb", kcal: 52, protein: 1.4, carbs: 11, fat: 0.7 },
  { id: "plantain-ripe", en: "Sweet Plantain (fried)", es: "Plátano Maduro Frito", serving: "1/2 cup", cat: "carb", kcal: 187, protein: 1, carbs: 32, fat: 6 },
  { id: "plantain-green", en: "Green Plantain (tostones)", es: "Plátano Verde (Tostones)", serving: "1/2 cup", cat: "carb", kcal: 165, protein: 1, carbs: 28, fat: 6 },
  { id: "yuca", en: "Yuca (boiled)", es: "Yuca (cocida)", serving: "1 cup", cat: "carb", kcal: 330, protein: 3, carbs: 78, fat: 0.6 },
  { id: "arepa", en: "Arepa", es: "Arepa", serving: "1 arepa", cat: "carb", kcal: 220, protein: 4, carbs: 36, fat: 7 },
  { id: "tamal", en: "Tamal", es: "Tamal", serving: "1 tamal", cat: "carb", kcal: 285, protein: 8, carbs: 30, fat: 14 },
  { id: "pupusa", en: "Pupusa", es: "Pupusa", serving: "1 pupusa", cat: "carb", kcal: 215, protein: 8, carbs: 26, fat: 10 },
  { id: "taco-pastor", en: "Al Pastor Taco", es: "Taco al Pastor", serving: "1 taco", cat: "carb", kcal: 170, protein: 10, carbs: 16, fat: 7 },
  { id: "taco-pollo", en: "Chicken Taco", es: "Taco de Pollo", serving: "1 taco", cat: "carb", kcal: 155, protein: 11, carbs: 15, fat: 6 },
  { id: "taco-carne", en: "Beef Taco", es: "Taco de Carne", serving: "1 taco", cat: "carb", kcal: 195, protein: 11, carbs: 16, fat: 10 },
  { id: "burrito", en: "Burrito", es: "Burrito", serving: "1 burrito", cat: "carb", kcal: 480, protein: 22, carbs: 60, fat: 16 },
  { id: "quesadilla", en: "Quesadilla", es: "Quesadilla", serving: "1 quesadilla", cat: "carb", kcal: 290, protein: 14, carbs: 26, fat: 14 },
  { id: "enchilada", en: "Enchilada", es: "Enchilada", serving: "1 enchilada", cat: "carb", kcal: 230, protein: 12, carbs: 22, fat: 11 },
  { id: "tostada", en: "Tostada", es: "Tostada", serving: "1 tostada", cat: "carb", kcal: 185, protein: 9, carbs: 18, fat: 8 },
  { id: "chilaquiles", en: "Chilaquiles", es: "Chilaquiles", serving: "1 plate", cat: "carb", kcal: 380, protein: 12, carbs: 38, fat: 20 },
  { id: "pozole", en: "Pozole", es: "Pozole", serving: "1 bowl", cat: "carb", kcal: 320, protein: 22, carbs: 30, fat: 12 },
  { id: "pan-dulce", en: "Sweet Bread (concha)", es: "Pan Dulce (Concha)", serving: "1 piece", cat: "carb", kcal: 280, protein: 6, carbs: 44, fat: 9 },
  { id: "white-bread", en: "White Bread", es: "Pan Blanco", serving: "1 slice", cat: "carb", kcal: 75, protein: 2, carbs: 14, fat: 1 },
  { id: "english-muffin", en: "English Muffin", es: "Muffin Inglés", serving: "1 muffin", cat: "carb", kcal: 134, protein: 5, carbs: 26, fat: 1 },
  { id: "couscous", en: "Couscous", es: "Cuscús", serving: "1 cup", cat: "carb", kcal: 176, protein: 6, carbs: 36, fat: 0.3 },

  { id: "lettuce", en: "Lettuce (romaine)", es: "Lechuga (romana)", serving: "1 cup", cat: "veg", kcal: 8, protein: 0.6, carbs: 1.5, fat: 0.1 },
  { id: "cucumber", en: "Cucumber", es: "Pepino", serving: "1 cup", cat: "veg", kcal: 16, protein: 0.7, carbs: 4, fat: 0.1 },
  { id: "onion", en: "Onion", es: "Cebolla", serving: "1/2 cup", cat: "veg", kcal: 32, protein: 0.9, carbs: 7, fat: 0.1 },
  { id: "mushrooms", en: "Mushrooms", es: "Champiñones", serving: "1 cup", cat: "veg", kcal: 15, protein: 2, carbs: 2, fat: 0.2 },
  { id: "cauliflower", en: "Cauliflower", es: "Coliflor", serving: "1 cup", cat: "veg", kcal: 27, protein: 2, carbs: 5, fat: 0.3 },
  { id: "squash", en: "Squash", es: "Calabaza", serving: "1 cup", cat: "veg", kcal: 76, protein: 1.8, carbs: 18, fat: 0.2 },
  { id: "cabbage", en: "Cabbage", es: "Repollo", serving: "1 cup", cat: "veg", kcal: 22, protein: 1.1, carbs: 5, fat: 0.1 },
  { id: "jalapeno", en: "Jalapeño", es: "Jalapeño", serving: "1 pepper", cat: "veg", kcal: 4, protein: 0.2, carbs: 0.9, fat: 0.1 },
  { id: "nopales", en: "Nopales", es: "Nopales", serving: "1 cup", cat: "veg", kcal: 14, protein: 1.2, carbs: 3, fat: 0.1 },
  { id: "guacamole", en: "Guacamole", es: "Guacamole", serving: "1/4 cup", cat: "fat", kcal: 100, protein: 1.3, carbs: 6, fat: 9 },
  { id: "pico-de-gallo", en: "Pico de Gallo", es: "Pico de Gallo", serving: "1/4 cup", cat: "veg", kcal: 18, protein: 0.7, carbs: 4, fat: 0.2 },
  { id: "salsa-roja", en: "Red Salsa", es: "Salsa Roja", serving: "2 tbsp", cat: "veg", kcal: 9, protein: 0.4, carbs: 2, fat: 0.1 },

  { id: "pear", en: "Pear", es: "Pera", serving: "1 medium", cat: "fruit", kcal: 101, protein: 0.6, carbs: 27, fat: 0.2 },
  { id: "peach", en: "Peach", es: "Durazno", serving: "1 medium", cat: "fruit", kcal: 59, protein: 1.4, carbs: 14, fat: 0.4 },
  { id: "papaya", en: "Papaya", es: "Papaya", serving: "1 cup", cat: "fruit", kcal: 62, protein: 0.7, carbs: 16, fat: 0.4 },
  { id: "cantaloupe", en: "Cantaloupe", es: "Melón", serving: "1 cup", cat: "fruit", kcal: 53, protein: 1.3, carbs: 13, fat: 0.3 },
  { id: "lime", en: "Lime", es: "Limón", serving: "1 lime", cat: "fruit", kcal: 20, protein: 0.5, carbs: 7, fat: 0.1 },

  { id: "coconut-oil", en: "Coconut Oil", es: "Aceite de Coco", serving: "1 tbsp", cat: "fat", kcal: 117, protein: 0, carbs: 0, fat: 13.6 },
  { id: "chia-seeds", en: "Chia Seeds", es: "Semillas de Chía", serving: "1 tbsp", cat: "fat", kcal: 58, protein: 2, carbs: 5, fat: 4 },
  { id: "cashews", en: "Cashews", es: "Anacardos", serving: "1 oz", cat: "fat", kcal: 157, protein: 5, carbs: 9, fat: 12 },
  { id: "olives", en: "Olives", es: "Aceitunas", serving: "10 olives", cat: "fat", kcal: 50, protein: 0.4, carbs: 3, fat: 5 },

  { id: "flan", en: "Flan", es: "Flan", serving: "1 slice", cat: "snack", kcal: 220, protein: 6, carbs: 35, fat: 7 },
  { id: "tres-leches", en: "Tres Leches Cake", es: "Pastel Tres Leches", serving: "1 slice", cat: "snack", kcal: 350, protein: 6, carbs: 46, fat: 16 },
  { id: "churro", en: "Churro", es: "Churro", serving: "1 churro", cat: "snack", kcal: 117, protein: 1, carbs: 12, fat: 7 },
  { id: "ice-cream", en: "Ice Cream", es: "Helado", serving: "1/2 cup", cat: "snack", kcal: 137, protein: 2, carbs: 16, fat: 7 },
  { id: "granola", en: "Granola", es: "Granola", serving: "1/2 cup", cat: "snack", kcal: 200, protein: 5, carbs: 30, fat: 7 },
  { id: "hummus", en: "Hummus", es: "Hummus", serving: "1/4 cup", cat: "snack", kcal: 100, protein: 5, carbs: 9, fat: 6 },
  { id: "muffin", en: "Blueberry Muffin", es: "Muffin de Arándanos", serving: "1 muffin", cat: "snack", kcal: 265, protein: 4, carbs: 38, fat: 11 },
  { id: "croissant", en: "Croissant", es: "Croissant", serving: "1 croissant", cat: "snack", kcal: 230, protein: 5, carbs: 26, fat: 12 },
  { id: "cookie", en: "Cookie (chocolate chip)", es: "Galleta (chispas)", serving: "1 cookie", cat: "snack", kcal: 78, protein: 0.9, carbs: 10, fat: 4 },
  { id: "popcorn", en: "Popcorn (air-popped)", es: "Palomitas (sin grasa)", serving: "3 cups", cat: "snack", kcal: 93, protein: 3, carbs: 19, fat: 1 },

  { id: "horchata", en: "Horchata", es: "Horchata", serving: "1 cup", cat: "drink", kcal: 220, protein: 1, carbs: 47, fat: 3 },
  { id: "agua-jamaica", en: "Hibiscus Tea (Jamaica)", es: "Agua de Jamaica", serving: "1 cup", cat: "drink", kcal: 90, protein: 0, carbs: 23, fat: 0 },
  { id: "cafe-leche", en: "Coffee with Milk", es: "Café con Leche", serving: "1 cup", cat: "drink", kcal: 60, protein: 3, carbs: 5, fat: 3 },
  { id: "green-tea", en: "Green Tea", es: "Té Verde", serving: "1 cup", cat: "drink", kcal: 2, protein: 0, carbs: 0, fat: 0 },
  { id: "gatorade", en: "Gatorade", es: "Gatorade", serving: "1 cup", cat: "drink", kcal: 50, protein: 0, carbs: 14, fat: 0 },
  { id: "beer-light", en: "Light Beer", es: "Cerveza Light", serving: "12 oz", cat: "drink", kcal: 103, protein: 1, carbs: 6, fat: 0 },
  { id: "beer", en: "Beer (regular)", es: "Cerveza Regular", serving: "12 oz", cat: "drink", kcal: 153, protein: 1.6, carbs: 13, fat: 0 },
  { id: "red-wine", en: "Red Wine", es: "Vino Tinto", serving: "5 oz", cat: "drink", kcal: 125, protein: 0, carbs: 4, fat: 0 },
];
