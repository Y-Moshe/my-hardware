function saveToStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage<T>(key: string): T | null {
  const data = localStorage.getItem(key)
  return data ? (JSON.parse(data) as T) : null
}

function getRandomInt(min: number = 0, max: number = 100) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const utilService = {
  saveToStorage,
  loadFromStorage,
  getRandomInt,
}
