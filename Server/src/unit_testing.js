import app from './app.js'

test('database works properly', async () => {
  try {
    await app.getDBConnection();
    expect(true).toBe(true);
    return;
  } catch (error) {
    console.error("This is the error: " + error)
    expect("pokemon").toBe("dog");
  }
})