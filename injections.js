export const greetings = ['hi', 'hello', 'heyy', 'hey', 'hii', 'hiii', 'wetin dey', ];

export const RandomGreeting = () => {
    return greetings[Math.floor(Math.random() * greetings.length)];
}