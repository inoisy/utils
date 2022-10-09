async function executeWithDelay(fn, delay) {
  try {
    const startTime = Date.now()
    const res = await fn()
    const delayLeft = delay - (Date.now() - startTime)
    if (delayLeft > 0) {
      await new Promise(resolve => setTimeout(resolve, delayLeft))
    }
    return res
  } catch(e) {
    throw e
  }
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
