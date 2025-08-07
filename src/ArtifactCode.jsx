import React, { useState, useEffect } from 'react';
import { Sparkles, Eye, Flame, Clock, Moon, Star, Sun } from 'lucide-react';

const AstrologyMentorshipGame = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [dilemma, setDilemma] = useState('');
  const [solutions, setSolutions] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [revealedSolution, setRevealedSolution] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cardsRevealed, setCardsRevealed] = useState(false);
  const [isGeneratingSolution, setIsGeneratingSolution] = useState(false);

  const paths = [
    { id: 1, name: "The Flame of Agni", subtitle: "Act with fire. Follow passion and leap.", theme: "adventurous, impulsive", icon: "🔥" },
    { id: 2, name: "The Serpent of Shesha", subtitle: "Wait. Watch. Observe the coils of time.", theme: "patient, thoughtful", icon: "🐍" },
    { id: 3, name: "The Mirror of Maya", subtitle: "Not all is as it seems.", theme: "confused, doubting", icon: "🪞" },
    { id: 4, name: "The Path of Arjuna", subtitle: "Face your dharma. Clarity lies in duty.", theme: "conflicted but willing to act", icon: "🏹" },
    { id: 5, name: "The Ocean of Samudra", subtitle: "Flow and let things settle.", theme: "go with the flow, unsure", icon: "🌊" },
    { id: 6, name: "The Crown of Saraswati", subtitle: "Seek wisdom before action.", theme: "intellectual, contemplative", icon: "👑" },
    { id: 7, name: "The Veil of Chhaya", subtitle: "Retreat and reflect in silence.", theme: "overwhelmed, introverted", icon: "🌙" },
    { id: 8, name: "The Thunder of Indra", subtitle: "Strike while the skies are electric.", theme: "bold, assertive, decisive", icon: "⚡" },
    { id: 9, name: "The Lotus of Lakshmi", subtitle: "Choose grace and abundance.", theme: "optimistic, wanting good fortune", icon: "🪷" },
    { id: 10, name: "The Drum of Nandi", subtitle: "Trust the rhythm of your instincts.", theme: "intuitive, primal response", icon: "🥁" },
    { id: 11, name: "The Forge of Vishwakarma", subtitle: "Build. Shape. Plan it carefully.", theme: "creative and constructive", icon: "🔨" },
    { id: 12, name: "The Bow of Rama", subtitle: "Act with righteousness, even if it's hard.", theme: "morally grounded decision-making", icon: "🎯" },
    { id: 13, name: "The Sand of Kaal", subtitle: "Time will reveal the path.", theme: "accepting uncertainty, detached", icon: "⏳" },
    { id: 14, name: "The Eye of Kali", subtitle: "Destroy illusion. Cut to truth.", theme: "raw, fierce clarity, transformation", icon: "👁️" }
  ];

  const testAPI = async () => {
    console.log('Testing NVIDIA API via proxy...');
    
    try {
      // You'll need to replace this with your backend URL
     const PROXY_URL = 'https://path-helper.vercel.app/api/nvidia';
      
      const testPayload = {
        "model": "meta/llama-3.1-405b-instruct",
        "messages": [{"role": "user", "content": "Hello, respond with just 'API working'"}],
        "max_tokens": 50,
        "temperature": 0.1
      };
      
      console.log('Sending test request to proxy:', testPayload);
      
      const response = await fetch(PROXY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(testPayload)
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Parsed response:', data);
        alert(`API Test Success! Response: ${data.choices?.[0]?.message?.content || 'No content'}`);
      } else {
        const errorText = await response.text();
        console.error('API Test Failed:', response.status, errorText);
        alert(`API Test Failed: ${response.status} - ${errorText}`);
      }
      
    } catch (error) {
      console.error('API Test Error:', error);
      alert(`Cannot connect to backend server. Please set up a proxy server first.\n\nError: ${error.message}`);
    }
  };

  const generateSolutionForPath = async (path, dilemma) => {
    // You'll need to replace this with your backend URL
    const PROXY_URL = 'http://localhost:3001/api/nvidia'; // Replace with your backend
    
    const modelsToTry = [
      "meta/llama-3.1-405b-instruct",
      "meta/llama-3.1-70b-instruct", 
      "meta/llama-3.1-8b-instruct",
      "nvidia/llama-3.1-nemotron-70b-instruct"
    ];

    const prompt = `You are an ancient mystic advisor. A person faces this dilemma: "${dilemma}"

Give guidance for the path of "${path.name}" - ${path.subtitle} (${path.theme}).

Provide 2-3 sentences of mystical but practical advice.`;

    for (const model of modelsToTry) {
      try {
        console.log(`Trying model: ${model} for ${path.name}...`);

        const response = await fetch(PROXY_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 200,
            "temperature": 0.7
          })
        });

        console.log(`${model} Response status:`, response.status);

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content?.trim();
          if (content) {
            console.log(`Success with ${model}:`, content);
            return content;
          }
        } else {
          const errorText = await response.text();
          console.log(`${model} failed:`, response.status, errorText);
        }
      } catch (error) {
        console.log(`${model} error:`, error.message);
      }
    }
    
    console.log('All models failed or no backend available, using fallback');
    return getFallbackSolution(path.id);
  };

  const getFallbackSolution = (pathId) => {
    const fallbackSolutions = {
      1: "Your dilemma requires bold action. Like Agni's flame, burn through hesitation and take that leap of faith.",
      2: "Patience, dear seeker. Like Shesha holding the universe, some things require time to unfold. Trust in the process.",
      3: "Question everything you think you know about this situation. Maya's mirror shows that reality has layers beyond the surface.",
      4: "Your duty calls, warrior. Like Arjuna on the battlefield, face your responsibilities with courage and clarity.",
      5: "Flow like water, adapt like the ocean. Work with the currents of change while maintaining your true direction.",
      6: "Gather knowledge before you act. Consult mentors and understand all angles to build the strongest foundation.",
      7: "Step back from the noise and chaos. Create sacred space for reflection where your inner voice can be heard.",
      8: "Strike now while opportunity presents itself. Like Indra's lightning, let decisive action create the power you need.",
      9: "Choose the path that brings beauty and prosperity. Trust that abundance is your birthright and act accordingly.",
      10: "Your gut feeling is speaking - listen to it. Beyond logic lies ancient wisdom that your body already knows.",
      11: "It's time to build something new. Plan carefully, gather your resources, and create your solution step by step.",
      12: "Do what is right, even if difficult. Your moral compass knows the answer - choose integrity over convenience.",
      13: "Release your need to control the outcome. Time is your ally - practice acceptance and let clarity emerge.",
      14: "Cut through all illusions and face the raw truth. Embrace the transformation, however uncomfortable it may be."
    };
    
    return fallbackSolutions[pathId] || "The universe has a unique message for your situation. Trust in the wisdom of this path.";
  };

  const generateSolutions = async (userDilemma) => {
    setIsLoading(true);
    
    const preparedSolutions = paths.map(path => ({
      ...path,
      solution: null
    }));
    
    setSolutions(preparedSolutions);
    setIsLoading(false);
    setCurrentStep(3);
  };

  const handleCardSelect = async (cardIndex) => {
    if (selectedCard !== null) return;
    
    setSelectedCard(cardIndex);
    const selectedPath = solutions[cardIndex];
    setIsGeneratingSolution(true);
    
    try {
      console.log(`Generating solution for selected path: ${selectedPath.name}`);
      const generatedSolution = await generateSolutionForPath(selectedPath, dilemma);
      
      const pathWithSolution = {
        ...selectedPath,
        solution: generatedSolution
      };
      
      setRevealedSolution(pathWithSolution);
    } catch (error) {
      console.error('Error generating solution for selected path:', error);
      const pathWithFallback = {
        ...selectedPath,
        solution: getFallbackSolution(selectedPath.id)
      };
      setRevealedSolution(pathWithFallback);
    }
    
    setIsGeneratingSolution(false);
    
    setTimeout(() => {
      setCardsRevealed(true);
      setCurrentStep(5);
    }, 1000);
  };

  const resetGame = () => {
    setCurrentStep(1);
    setDilemma('');
    setSolutions([]);
    setSelectedCard(null);
    setRevealedSolution(null);
    setIsLoading(false);
    setCardsRevealed(false);
    setIsGeneratingSolution(false);
  };

  const renderStep1 = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <Star className="mx-auto w-16 h-16 text-yellow-400" />
        <h1 className="text-4xl font-bold text-white mb-2">Cosmic Guidance</h1>
        <p className="text-purple-200 text-lg">Ancient wisdom for modern dilemmas</p>
      </div>
      
      <div className="bg-purple-800/30 backdrop-blur-sm rounded-lg p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-white">What weighs on your mind?</h2>
        <textarea
          value={dilemma}
          onChange={(e) => setDilemma(e.target.value)}
          placeholder="Share your dilemma, challenge, or decision you're facing..."
          className="w-full h-32 p-4 rounded-lg bg-purple-700/50 text-white placeholder-purple-300 border border-purple-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => generateSolutions(dilemma)}
            disabled={!dilemma.trim()}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-8 py-3 rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Seek Cosmic Wisdom
          </button>
          <button
            onClick={testAPI}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-400 hover:to-green-500 transition-all"
          >
            Test API
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <Sparkles className="mx-auto w-16 h-16 text-yellow-400 animate-spin" />
        <h2 className="text-3xl font-bold text-white">The Universe is Listening...</h2>
        <p className="text-purple-200">Preparing the cosmic cards for your journey</p>
      </div>
      
      <div className="bg-purple-800/30 backdrop-blur-sm rounded-lg p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-purple-600 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-purple-600 rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-purple-600 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <Eye className="mx-auto w-16 h-16 text-yellow-400" />
        <h2 className="text-3xl font-bold text-white">Choose Your Destiny</h2>
        <p className="text-purple-200">14 paths await. Trust your intuition and select one card.</p>
      </div>
      
      <div className="grid grid-cols-7 gap-4 max-w-4xl mx-auto">
        {Array.from({ length: 14 }).map((_, index) => (
          <div
            key={index}
            onClick={() => handleCardSelect(index)}
            className={`
              aspect-[3/4] bg-gradient-to-br from-purple-800 to-purple-900 rounded-lg cursor-pointer
              transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50
              border-2 border-purple-600 flex items-center justify-center
              ${selectedCard === index ? 'ring-4 ring-yellow-400 scale-105' : ''}
            `}
          >
            <div className="text-center">
              <Moon className="w-8 h-8 text-purple-300 mx-auto mb-2" />
              <div className="text-xs text-purple-300">Card {index + 1}</div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedCard !== null && isGeneratingSolution && (
        <div className="bg-purple-800/50 backdrop-blur-sm rounded-lg p-6 mt-6">
          <div className="flex items-center justify-center space-x-3">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" />
            <p className="text-yellow-300">The cosmos is weaving your destiny...</p>
          </div>
        </div>
      )}
      
      {selectedCard !== null && !isGeneratingSolution && !cardsRevealed && (
        <p className="text-yellow-300 animate-pulse">Your destiny unfolds...</p>
      )}
    </div>
  );

  const renderStep5 = () => (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <Sun className="mx-auto w-16 h-16 text-yellow-400" />
        <h2 className="text-3xl font-bold text-white">Your Path Revealed</h2>
      </div>
      
      <div className="grid grid-cols-7 gap-4 max-w-4xl mx-auto mb-8">
        {Array.from({ length: 14 }).map((_, index) => (
          <div
            key={index}
            className={`
              aspect-[3/4] rounded-lg transition-all duration-1000
              ${index === selectedCard 
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 transform scale-110 shadow-lg shadow-yellow-500/50' 
                : cardsRevealed 
                  ? 'bg-gray-600 opacity-30 transform scale-95' 
                  : 'bg-gradient-to-br from-purple-800 to-purple-900'
              }
              border-2 ${index === selectedCard ? 'border-yellow-300' : 'border-purple-600'}
              flex items-center justify-center
            `}
          >
            {index === selectedCard ? (
              <div className="text-center p-2">
                <div className="text-2xl mb-1">{revealedSolution?.icon}</div>
                <div className="text-xs text-purple-900 font-bold">Your Path</div>
              </div>
            ) : (
              <div className="text-center">
                <Moon className={`w-6 h-6 mx-auto mb-1 ${cardsRevealed ? 'text-gray-500' : 'text-purple-300'}`} />
                <div className={`text-xs ${cardsRevealed ? 'text-gray-500' : 'text-purple-300'}`}>
                  {cardsRevealed ? '—' : `Card ${index + 1}`}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {revealedSolution && (
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 text-purple-900 rounded-lg p-8 max-w-2xl mx-auto">
          <div className="text-4xl mb-4">{revealedSolution.icon}</div>
          <h3 className="text-2xl font-bold mb-2">{revealedSolution.name}</h3>
          <p className="text-lg italic mb-4">"{revealedSolution.subtitle}"</p>
          <div className="bg-white/50 rounded-lg p-6">
            <h4 className="font-semibold mb-3">Your Cosmic Guidance:</h4>
            <p className="leading-relaxed">{revealedSolution.solution}</p>
          </div>
        </div>
      )}
      
      <button
        onClick={resetGame}
        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-500 hover:to-purple-600 transition-all"
      >
        Seek New Guidance
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {currentStep === 1 && renderStep1()}
        {(currentStep === 2 || isLoading) && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 5 && renderStep5()}
      </div>
      
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AstrologyMentorshipGame;
