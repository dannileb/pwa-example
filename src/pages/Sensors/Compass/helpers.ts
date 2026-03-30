const DIRECTIONS = ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"];

export function getDirectionByDeviation(deviation: number) {
  return DIRECTIONS.at(Math.round(deviation / 45)) ?? DIRECTIONS[0];
}
