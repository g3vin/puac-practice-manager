import React, { useEffect, useState } from 'react';
import './RandomWelcomeMessage.css';

const RandomWelcomeMessage = () => {
    const welcomeMessages = [
        "Shoot a bullseye!",
        "Split an arrow!",
        "Did you know the world record for the longest archery shot is 2,047 yards?",
        "Go for gold!",
        "Yes, our shed is usually full of mice, but also love and joy and kindness. No one ever asks about that, though.",
        "You won't bowlieve how much fun archery is! Get it? BOW-lieve.",
        "Everyone says good things come in threes... That's why our practices are three dollars.",
        "Don't hit your arm pookie that hurts! Unless u freaky like that??",
        "PLEASE PLEASE PLEASE BE IN THE TEN RING",
        "If you miss, try try again. Or quit! Up to you honestly it's your life.",
        "The Lancaster Classic, one of the largerst indoor archery tournaments, hosts over 3,000 archers every year in Lancaster PA.",
        "A perfect indoor round is 300 points, and for outdoor it's 360!",
        "If your favorite constellation isn't Orion are you really an archer?",
        "Shoot for the sky! WAIT PLEASE DON'T DO THAT OH YOU ALREADY DID EVERYONE RUNNNNN",
        "If you find more than 50 arrows in the woods, you win a prize.",
        "Barebow does NOT mean you shoot naked... we can NOT have second incident okay",
        "Wait stand right over there and put this apple on your head. Okay now stay perrrrrrfectly still",
        "Robin Hood was lowkey so humble like I'd keep all the stuff I stole because I'm broke af",
        "One time I ate 100 cold dinsour nuggets in one sitting. I didn't even use ketchup. Wait, what is this for again?",
        "If you ever shoot someone with an arrow, don't panic, we have band-aids!",
        "y = (tan θ)x - gx^2/2(vcosθ)^2 Put that physics you learned into practice!",
        "If you hear more than 4 whistles, STOP SHOOTING!",
        "Follow the arrow!"
    ];

    const [randomMessage, setRandomMessage] = useState('');

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
        setRandomMessage(welcomeMessages[randomIndex]);
    }, []);

    return (
        <div className='msg'>
            <p>{randomMessage}</p>
        </div>
    );
};

export default RandomWelcomeMessage;