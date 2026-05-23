import { FOOD_DB } from "../../lib/nutrition.js";

export default function AddFoodModal({
  text,
  language,
  addFoodTarget,
  setAddFoodTarget,
  foodSearch,
  setFoodSearch,
  customFoods,
  recentFoods,
  customFoodDraft,
  setCustomFoodDraft,
  addFoodEntry,
  addCustomFood,
}) {
  const query = foodSearch.trim().toLowerCase();
  const displayName = food => food.name || (language === "es" ? food.es : food.en);
  const mealLabels = { breakfast: text.breakfast, lunch: text.lunch, dinner: text.dinner, snack: text.snack };
  const allFoods = [...customFoods, ...FOOD_DB];
  const filtered = allFoods.filter(food => {
    if (!query) return true;
    return `${food.name || ""} ${food.en || ""} ${food.es || ""}`.toLowerCase().includes(query);
  }).slice(0, 40);

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 12, letterSpacing: 2, fontFamily: "'Orbitron', monospace", fontWeight: 900 }}>
            {text.addFood.toUpperCase()} · {mealLabels[addFoodTarget].toUpperCase()}
          </p>
          <button className="edit-btn" onClick={() => setAddFoodTarget(null)} style={{ padding: "8px 12px" }}>{text.doneBtn}</button>
        </div>

        <input className="input" value={foodSearch} onChange={event => setFoodSearch(event.target.value)} placeholder={text.searchFood} style={{ marginBottom: 10 }} />

        {recentFoods.length > 0 && !query && (
          <div style={{ marginBottom: 12 }}>
            <p className="menu-section-label">{text.recentFoods.toUpperCase()}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
              {recentFoods.slice(0, 8).map(food => (
                <button key={food.id} className="album-chip" onClick={() => addFoodEntry(addFoodTarget, { ...food, qty: 1 })}>
                  + {food.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gap: 6, maxHeight: "34vh", overflow: "auto", marginBottom: 14 }}>
          {filtered.map((food, index) => {
            const name = displayName(food);
            return (
              <button
                key={food.id || `${name}-${index}`}
                className="dark-btn"
                onClick={() => addFoodEntry(addFoodTarget, { id: food.id, name, kcal: food.kcal, protein: food.protein, carbs: food.carbs, fat: food.fat, qty: 1 })}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left", gap: 10 }}
              >
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontWeight: 800, fontSize: 13 }}>{name}</span>
                  <span style={{ display: "block", fontSize: 11, color: "#8A8F99", marginTop: 2 }}>{food.serving || "1 serving"} · P{food.protein} C{food.carbs} F{food.fat}</span>
                </span>
                <span style={{ color: "#3FB98A", fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 900, flexShrink: 0 }}>{food.kcal}</span>
              </button>
            );
          })}
        </div>

        <p className="menu-section-label">{text.customFood.toUpperCase()}</p>
        <div style={{ display: "grid", gap: 8, marginTop: 6 }}>
          <input className="input" value={customFoodDraft.name} onChange={event => setCustomFoodDraft(prev => ({ ...prev, name: event.target.value }))} placeholder={text.foodName} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {[["kcal", "kcal"], ["protein", "P"], ["carbs", "C"], ["fat", "F"]].map(([field, label]) => (
              <input
                key={field}
                className="input"
                type="number"
                inputMode="numeric"
                value={customFoodDraft[field]}
                onChange={event => setCustomFoodDraft(prev => ({ ...prev, [field]: event.target.value }))}
                placeholder={label}
              />
            ))}
          </div>
          <button className="primary-btn" onClick={addCustomFood}>{text.saveFood}</button>
        </div>
      </div>
    </div>
  );
}
