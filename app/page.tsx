"use client"

import { useState, useEffect, useRef, createContext, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, MapPin, Navigation, CheckCircle, CornerDownRight, RefreshCw, X, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Language context
const LanguageContext = createContext({
  language: "en",
  setLanguage: (lang) => {},
  t: (key) => "",
  getCampusData: () => ({
    locations: [],
    paths: [],
    findPath: () => null,
    getMilestones: () => [],
  }),
})

// Translations
const translations = {
  en: {
    // App title and descriptions
    appTitle: "Campus Navigation",
    appDescription: "Find your way around campus",

    // Initial messages
    welcomeMessage: "Hi! I'm your campus navigation assistant. Where are you currently located?",

    // Location selection
    selectLocation: "Select your current location:",
    greatLocation: "Great! You're at {location}. Where would you like to go?",
    alreadyThere: "You're already at that location! Please choose a different destination.",

    // Destination selection
    selectDestination: "Select your destination:",
    noPathFound: "I'm sorry, I don't know how to get from {from} to {to}. Please choose another destination.",

    // Navigation
    helpGetFrom: "I'll help you get from {from} to {to}. Here's your first direction: {direction}",
    reachedLandmark: "Please let me know when you've reached this landmark.",
    completedStep: "Let me know when you've completed this step.",
    continueDirection: "Great! Let's continue with the next direction.",

    // End of navigation
    reachedDestination:
      "You've reached your destination: {destination}! Would you like to get directions to somewhere else or end the navigation?",
    thankYou: "Thank you for using the Campus Navigation Bot! Have a great day!",

    // Buttons and controls
    nextDirection: "Next direction",
    reachedLandmarkBtn: "I've reached this landmark",
    getNewDirections: "Get new directions",
    endNavigation: "End navigation",
    typeMessage: "Type a message...",
    progress: "Progress",
    ofSteps: "of {total} steps",

    // Language names
    english: "English",
    hindi: "Hindi",
    telugu: "Telugu",
    language: "Language",
  },
  hi: {
    // App title and descriptions
    appTitle: "कैंपस नेविगेशन",
    appDescription: "कैंपस में अपना रास्ता खोजें",

    // Initial messages
    welcomeMessage: "नमस्ते! मैं आपका ���ैंपस नेविगेशन सहायक हूं। आप वर्तमान में कहां स्थित हैं?",

    // Location selection
    selectLocation: "अपना वर्तमान स्थान चुनें:",
    greatLocation: "बढ़िया! आप {location} पर हैं। आप कहां जाना चाहते हैं?",
    alreadyThere: "आप पहले से ही उस स्थान पर हैं! कृपया कोई अलग गंतव्य चुनें।",

    // Destination selection
    selectDestination: "अपना गंतव्य चुनें:",
    noPathFound: "मुझे खेद है, मुझे नहीं पता कि {from} से {to} तक कैसे जाना है। कृपया कोई अन्य गंतव्य चुनें।",

    // Navigation
    helpGetFrom: "मैं आपको {from} से {to} तक पहुंचने में मदद करूंगा। यहां आपका पहला निर्देश है: {direction}",
    reachedLandmark: "कृपया मुझे बताएं जब आप इस लैंडमार्क तक पहुंच जाएं।",
    completedStep: "जब आप यह चरण पूरा कर लें तो मुझे बताएं।",
    continueDirection: "बढ़िया! अगले निर्देश के साथ जारी रखें।",

    // End of navigation
    reachedDestination:
      "आप अपने गंतव्य पर पहुंच गए हैं: {destination}! क्या आप कहीं और के लिए दिशा-निर्देश प्राप्त करना चाहते हैं या नेविगेशन समाप्त करना चाहते हैं?",
    thankYou: "कैंपस नेविगेशन बॉट का उपयोग करने के लिए धन्यवाद! आपका दिन शुभ हो!",

    // Buttons and controls
    nextDirection: "अगला निर्देश",
    reachedLandmarkBtn: "मैं इस लैंडमार्क तक पहुंच गया हूं",
    getNewDirections: "नए दिशा-निर्देश प्राप्त करें",
    endNavigation: "नेविगेशन समाप्त करें",
    typeMessage: "संदेश लिखें...",
    progress: "प्रगति",
    ofSteps: "{total} चरणों में से",

    // Language names
    english: "अंग्रेज़ी",
    hindi: "हिंदी",
    telugu: "तेलुगु",
    language: "भाषा",
  },
  te: {
    // App title and descriptions
    appTitle: "క్యాంపస్ నావిగేషన్",
    appDescription: "క్యాంపస్‌లో మీ మార్గాన్ని కనుగొనండి",

    // Initial messages
    welcomeMessage: "హాయ్! నేను మీ క్యాంపస్ నావిగేషన్ సహాయకుడిని. మీరు ప్రస్తుతం ఎక్కడ ఉన్నారు?",

    // Location selection
    selectLocation: "మీ ప్రస్తుత స్థానాన్ని ఎంచుకోండి:",
    greatLocation: "గొప్ప! మీరు {location}లో ఉన్నారు. మీరు ఎక్కడికి వెళ్లాలనుకుంటున్నారు?",
    alreadyThere: "మీరు ఇప్పటికే ఆ స్థానంలో ఉన్నారు! దయచేసి వేరే గమ్యస్థానాన్ని ఎంచుకోండి.",

    // Destination selection
    selectDestination: "మీ గమ్యస్థానాన్ని ఎంచుకోండి:",
    noPathFound: "క్షమించండి, {from} నుండి {to} వరకు ఎలా వెళ్లాలో నాకు తెలియదు. దయచేసి మరొక గమ్యస్థానాన్ని ఎంచుకోండి.",

    // Navigation
    helpGetFrom: "నేను మిమ్మల్ని {from} నుండి {to} వరకు చేరుకోవడానికి సహాయం చేస్తాను. ఇదిగో మీ మొదటి దిశ: {direction}",
    reachedLandmark: "దయచేసి మీరు ఈ ల్యాండ్‌మార్క్‌ను చేరుకున్నప్పుడు నాకు తెలియజేయండి.",
    completedStep: "మీరు ఈ దశను పూర్తి చేసినప్పుడు నాకు తెలియజేయండి.",
    continueDirection: "గొప్ప! తదుపరి దిశతో కొనసాగించండి.",

    // End of navigation
    reachedDestination:
      "మీరు మీ గమ్యస్థానానికి చేరుకున్నారు: {destination}! మీరు మరెక్కడికైనా దిశలు పొందాలనుకుంటున్నారా లేదా నావిగేషన్‌ను ముగించాలనుకుంటున్నారా?",
    thankYou: "క్యాంపస్ నావిగేషన్ బాట్‌ని ఉపయోగించినందుకు ధన్యవాదాలు! మీ రోజు శుభంగా ఉండాలి!",

    // Buttons and controls
    nextDirection: "తదుపరి దిశ",
    reachedLandmarkBtn: "నేను ఈ ల్యాండ్‌మార్క్‌ని చేరుకున్నాను",
    getNewDirections: "కొత్త దిశలు పొందండి",
    endNavigation: "నావిగేషన్ ముగించండి",
    typeMessage: "సందేశాన్ని టైప్ చేయండి...",
    progress: "పురోగతి",
    ofSteps: "{total} దశలలో",

    // Language names
    english: "ఆంగ్లం",
    hindi: "హిందీ",
    telugu: "తెలుగు",
    language: "భాష",
  },
}

// Campus data structure with locations and paths for each language
const campusData = {
  en: {
    // List of all campus locations in English
    locations: [
      "Main Building",
      "Library",
      "Science Center",
      "Student Union",
      "Dormitory A",
      "Dormitory B",
      "Sports Complex",
      "Cafeteria",
      "Parking Lot",
      "Administration Building",
    ],

    // Paths between locations with directions and milestones in English
    paths: [
      {
        from: "Main Building",
        to: "Library",
        directions: [
          "Exit Main Building through the front door",
          "Turn right and walk straight for 100 meters",
          "Pass by the fountain (milestone)",
          "Turn left at the intersection",
          "Walk straight for 50 meters",
          "The Library will be on your right",
        ],
      },
      {
        from: "Main Building",
        to: "Science Center",
        directions: [
          "Exit Main Building through the back door",
          "Walk straight for 150 meters",
          "Pass by the garden (milestone)",
          "Turn right at the path junction",
          "Walk straight for 100 meters",
          "The Science Center will be directly in front of you",
        ],
      },
      {
        from: "Library",
        to: "Student Union",
        directions: [
          "Exit the Library through the main entrance",
          "Turn right and walk straight for 80 meters",
          "Pass by the statue (milestone)",
          "Turn left at the crosswalk",
          "Walk straight for 70 meters",
          "The Student Union will be on your left",
        ],
      },
      {
        from: "Student Union",
        to: "Cafeteria",
        directions: [
          "Exit the Student Union through the side door",
          "Turn right and walk straight for 50 meters",
          "Pass by the bulletin board (milestone)",
          "Continue straight for another 30 meters",
          "The Cafeteria will be directly in front of you",
        ],
      },
    ],
  },

  hi: {
    // List of all campus locations in Hindi
    locations: [
      "मुख्य भवन",
      "पुस्तकालय",
      "विज्ञान केंद्र",
      "छात्र संघ",
      "छात्रावास A",
      "छात्रावास B",
      "खेल परिसर",
      "कैफेटेरिया",
      "पार्किंग स्थल",
      "प्रशासन भवन",
    ],

    // Paths between locations with directions and milestones in Hindi
    paths: [
      {
        from: "मुख्य भवन",
        to: "पुस्तकालय",
        directions: [
          "मुख्य भवन से सामने के दरवाजे से बाहर निकलें",
          "दाएं मुड़ें और 100 मीटर सीधे चलें",
          "फव्वारे के पास से गुजरें (मील का पत्थर)",
          "चौराहे पर बाएं मुड़ें",
          "50 मीटर सीधे चलें",
          "पुस्तकालय आपके दाईं ओर होगा",
        ],
      },
      {
        from: "मुख्य भवन",
        to: "विज्ञान केंद्र",
        directions: [
          "मुख्य भवन से पिछले दरवाजे से बाहर निकलें",
          "150 मीटर सीधे चलें",
          "बगीचे के पास से गुजरें (मील का पत्थर)",
          "पथ जंक्शन पर दाएं मुड़ें",
          "100 मीटर सीधे चलें",
          "विज्ञान केंद्र सीधे आपके सामने होगा",
        ],
      },
      {
        from: "पुस्तकालय",
        to: "छात्र संघ",
        directions: [
          "पुस्तकालय से मुख्य प्रवेश द्वार से बाहर निकलें",
          "दाएं मुड़ें और 80 मीटर सीधे चलें",
          "मूर्ति के पास से गुजरें (मील का पत्थर)",
          "क्रॉसवॉक पर बाएं मुड़ें",
          "70 मीटर सीधे चलें",
          "छात्र संघ आपके बाईं ओर होगा",
        ],
      },
      {
        from: "छात्र संघ",
        to: "कैफेटेरिया",
        directions: [
          "छात्र संघ से साइड डोर से बाहर निकलें",
          "दाएं मुड़ें और 50 मीटर सीधे चलें",
          "बुलेटिन बोर्ड के पास से गुजरें (मील का पत्थर)",
          "30 मीटर और सीधे चलें",
          "कैफेटेरिया सीधे आपके सामने होगा",
        ],
      },
    ],
  },

  te: {
    // List of all campus locations in Telugu
    locations: [
      "ప్రధాన భవనం",
      "గ్రంథాలయం",
      "సైన్స్ సెంటర్",
      "విద్యార్థి సంఘం",
      "వసతిగృహం A",
      "వసతిగృహం B",
      "క్రీడా సముదాయం",
      "క్యాంటీన్",
      "పార్కింగ్ స్థలం",
      "పరిపాలన భవనం",
    ],

    // Paths between locations with directions and milestones in Telugu
    paths: [
      {
        from: "ప్రధాన భవనం",
        to: "గ్రంథాలయం",
        directions: [
          "ప్రధాన భవనం నుండి ముందు ద్వారం గుండా బయటకు వెళ్లండి",
          "కుడివైపు తిరిగి 100 మీటర్లు సరళంగా నడవండి",
          "ఫౌంటెన్ దగ్గర నుండి వెళ్లండి (మైలురాయి)",
          "కూడలి వద్ద ఎడమవైపు తిరగండి",
          "50 మీటర్లు సరళంగా నడవండి",
          "గ్రంథాలయం మీ కుడివైపున ఉంటుంది",
        ],
      },
      {
        from: "ప్రధాన భవనం",
        to: "సైన్స్ సెంటర్",
        directions: [
          "ప్రధాన భవనం నుండి వెనుక ద్వారం గుండా బయటకు వెళ్లండి",
          "150 మీటర్లు సరళంగా నడవండి",
          "తోట దగ్గర నుండి వెళ్లండి (మైలురాయి)",
          "దారి జంక్షన్ వద్ద కుడివైపు తిరగండి",
          "100 మీటర్లు సరళంగా నడవండి",
          "సైన్స్ సెంటర్ నేరుగా మీ ముందు ఉంటుంది",
        ],
      },
      {
        from: "గ్రంథాలయం",
        to: "విద్యార్థి సంఘం",
        directions: [
          "గ్రంథాలయం నుండి ప్రధాన ప్రవేశద్వారం గుండా బయటకు వెళ్లండి",
          "కుడివైపు తిరిగి 80 మీటర్లు సరళంగా నడవండి",
          "విగ్రహం దగ్గర నుండి వెళ్లండి (మైలురాయి)",
          "క్రాస్‌వాక్ వద్ద ఎడమవైపు తిరగండి",
          "70 మీటర్లు సరళంగా నడవండి",
          "విద్యార్థి సంఘం మీ ఎడమవైపున ఉంటుంది",
        ],
      },
      {
        from: "విద్యార్థి సంఘం",
        to: "క్యాంటీన్",
        directions: [
          "విద్యార్థి సంఘం నుండి పక్క ద్వారం గుండా బయటకు వెళ్లండి",
          "కుడివైపు తిరిగి 50 మీటర్లు సరళంగా నడవండి",
          "బులెటిన్ బోర్డు దగ్గర నుండి వెళ్లండి (మైలురాయి)",
          "మరో 30 మీటర్లు సరళంగా కొనసాగించండి",
          "క్యాంటీన్ నేరుగా మీ ముందు ఉంటుంది",
        ],
      },
    ],
  },
}

// Add common functions to each language's data
Object.keys(campusData).forEach((lang) => {
  campusData[lang].findPath = function (from, to) {
    // First try to find a direct path
    const path = this.paths.find(
      (p) =>
        (p.from.toLowerCase() === from.toLowerCase() && p.to.toLowerCase() === to.toLowerCase()) ||
        (p.from.toLowerCase() === to.toLowerCase() && p.to.toLowerCase() === from.toLowerCase()),
    )

    // If direct path found, return it (reverse if needed)
    if (path) {
      if (path.from.toLowerCase() === to.toLowerCase() && path.to.toLowerCase() === from.toLowerCase()) {
        // Need to reverse the directions
        return {
          from: path.to,
          to: path.from,
          directions: [...path.directions].reverse().map((dir) => {
            // Swap left/right and some other direction words based on language
            if (lang === "en") {
              return dir
                .replace(/Turn left/g, "TEMP_RIGHT")
                .replace(/Turn right/g, "Turn left")
                .replace(/TEMP_RIGHT/g, "Turn right")
                .replace(/on your left/g, "TEMP_RIGHT")
                .replace(/on your right/g, "on your left")
                .replace(/TEMP_RIGHT/g, "on your right")
            } else if (lang === "hi") {
              return dir
                .replace(/बाएं मुड़ें/g, "TEMP_RIGHT")
                .replace(/दाएं मुड़ें/g, "बाएं मुड़ें")
                .replace(/TEMP_RIGHT/g, "दाएं मुड़ें")
                .replace(/बाईं ओर/g, "TEMP_RIGHT")
                .replace(/दाईं ओर/g, "बाईं ओर")
                .replace(/TEMP_RIGHT/g, "दाईं ओर")
            } else if (lang === "te") {
              return dir
                .replace(/ఎడమవైపు తిరగండి/g, "TEMP_RIGHT")
                .replace(/కుడివైపు తిరగండి/g, "ఎడమవైపు తిరగండి")
                .replace(/TEMP_RIGHT/g, "కుడివైపు తిరగండి")
                .replace(/ఎడమవైపున/g, "TEMP_RIGHT")
                .replace(/కుడివైపున/g, "ఎడమవైపున")
                .replace(/TEMP_RIGHT/g, "కుడివైపున")
            }
            return dir
          }),
        }
      }
      return path
    }

    // If no direct path, return null (could implement path finding algorithm here)
    return null
  }

  campusData[lang].getMilestones = (directions) => {
    const milestoneText = lang === "en" ? "milestone" : lang === "hi" ? "मील का पत्थर" : "మైలురాయి"
    return directions
      .filter((dir) => dir.includes(`(${milestoneText})`))
      .map((dir) => {
        return dir.replace(` (${milestoneText})`, "")
      })
  }
})

// Language Provider component
function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en")

  // Translation function
  const t = (key, replacements = {}) => {
    let text = translations[language][key] || key

    // Replace placeholders with actual values
    Object.keys(replacements).forEach((placeholder) => {
      const value = replacements[placeholder]
      text = text.replace(`{${placeholder}}`, value)
    })

    return text
  }

  // Get campus data for current language
  const getCampusData = () => {
    return campusData[language] || campusData.en
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getCampusData }}>{children}</LanguageContext.Provider>
  )
}

// Hook to use language context
function useLanguage() {
  return useContext(LanguageContext)
}

// Language Switcher component
function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="absolute top-2 right-2 z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Globe className="h-3.5 w-3.5" />
            <span className="sr-only md:not-sr-only md:inline-block">{t("language")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-muted" : ""}>
            {t("english")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage("hi")} className={language === "hi" ? "bg-muted" : ""}>
            {t("hindi")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage("te")} className={language === "te" ? "bg-muted" : ""}>
            {t("telugu")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Message component
function Message({ message, isUser }) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Navigation className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isUser ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none"
        }`}
      >
        {message}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 ml-2 flex-shrink-0">
          <AvatarFallback className="bg-secondary text-secondary-foreground">U</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

// Location Button Grid component
function LocationButtonGrid({ locations, onSelect, filterText = "" }) {
  // Sort locations based on the filter text
  const sortedLocations = [...locations].sort((a, b) => {
    const aStartsWithFilter = a.toLowerCase().startsWith(filterText.toLowerCase())
    const bStartsWithFilter = b.toLowerCase().startsWith(filterText.toLowerCase())
    const aContainsFilter = a.toLowerCase().includes(filterText.toLowerCase())
    const bContainsFilter = b.toLowerCase().includes(filterText.toLowerCase())

    // First priority: starts with filter
    if (aStartsWithFilter && !bStartsWithFilter) return -1
    if (!aStartsWithFilter && bStartsWithFilter) return 1

    // Second priority: contains filter
    if (aContainsFilter && !bContainsFilter) return -1
    if (!aContainsFilter && bContainsFilter) return 1

    // Default: alphabetical
    return a.localeCompare(b)
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
      {sortedLocations.map((location) => (
        <Button
          key={location}
          variant="outline"
          className={`justify-start h-auto py-2 px-3 text-left ${
            filterText && location.toLowerCase().includes(filterText.toLowerCase()) ? "border-primary" : ""
          }`}
          onClick={() => onSelect(location)}
        >
          <MapPin className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
          <span className="text-sm truncate">{location}</span>
        </Button>
      ))}
    </div>
  )
}

// Navigation Controls component
function NavigationControls({ onNext, onMilestoneReached, isWaitingForMilestone }) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col space-y-2 mb-4">
      {isWaitingForMilestone ? (
        <Button onClick={onMilestoneReached} className="w-full">
          <CheckCircle className="h-4 w-4 mr-2" />
          {t("reachedLandmarkBtn")}
        </Button>
      ) : (
        <Button onClick={onNext} className="w-full">
          <CornerDownRight className="h-4 w-4 mr-2" />
          {t("nextDirection")}
        </Button>
      )}
    </div>
  )
}

// End Navigation Options component
function EndNavigationOptions({ onNewDirections, onEndChat }) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col space-y-2 mb-4">
      <Button onClick={onNewDirections} variant="outline" className="w-full">
        <RefreshCw className="h-4 w-4 mr-2" />
        {t("getNewDirections")}
      </Button>
      <Button onClick={onEndChat} variant="destructive" className="w-full">
        <X className="h-4 w-4 mr-2" />
        {t("endNavigation")}
      </Button>
    </div>
  )
}

// Progress indicator component
function ProgressIndicator({ currentStep, totalSteps }) {
  const { t } = useLanguage()
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{t("progress")}</span>
        <span>
          {currentStep} {t("ofSteps", { total: totalSteps })}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}

// Update the CampusNavigationBot component to handle text input and filtering
function CampusNavigationBot() {
  const { t, language, getCampusData } = useLanguage()
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: t("welcomeMessage"),
    },
  ])
  const [input, setInput] = useState("")
  const [currentLocation, setCurrentLocation] = useState("")
  const [destination, setDestination] = useState("")
  const [currentPath, setCurrentPath] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [waitingForMilestone, setWaitingForMilestone] = useState(false)
  const [conversationState, setConversationState] = useState("asking_location")
  const [showLocationSelection, setShowLocationSelection] = useState(true)
  const [showDestinationSelection, setShowDestinationSelection] = useState(false)
  const [showNavigationControls, setShowNavigationControls] = useState(false)
  const [showEndOptions, setShowEndOptions] = useState(false)
  const [locationFilter, setLocationFilter] = useState("")
  const [destinationFilter, setDestinationFilter] = useState("")

  const messagesEndRef = useRef(null)

  // Update welcome message when language changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === "bot") {
      setMessages([
        {
          sender: "bot",
          text: t("welcomeMessage"),
        },
      ])
    }

    // Reset the UI when language changes to avoid inconsistencies
    if (currentLocation || destination) {
      // Get the current campus data
      const data = getCampusData()

      // Try to find equivalent locations in the new language
      const locationIndex = campusData.en.locations.findIndex(
        (loc) => loc.toLowerCase() === currentLocation.toLowerCase(),
      )

      const destinationIndex = destination
        ? campusData.en.locations.findIndex((loc) => loc.toLowerCase() === destination.toLowerCase())
        : -1

      // Update current location and destination with translated versions
      if (locationIndex >= 0 && locationIndex < data.locations.length) {
        setCurrentLocation(data.locations[locationIndex])
      }

      if (destinationIndex >= 0 && destinationIndex < data.locations.length) {
        setDestination(data.locations[destinationIndex])
      }
    }
  }, [language])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    // Add a small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })

        // Force scroll to bottom of container as a fallback
        const container = document.querySelector(".max-h-\\[60vh\\]")
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [messages])

  // Handle location selection
  const handleLocationSelect = (location) => {
    setCurrentLocation(location)
    setShowLocationSelection(false)
    setLocationFilter("")

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: location },
      { sender: "bot", text: t("greatLocation", { location }) },
    ])

    setConversationState("asking_destination")
    setShowDestinationSelection(true)
  }

  // Handle destination selection
  const handleDestinationSelect = (destination) => {
    if (destination === currentLocation) {
      setMessages((prev) => [...prev, { sender: "bot", text: t("alreadyThere") }])
      return
    }

    setDestination(destination)
    setShowDestinationSelection(false)
    setDestinationFilter("")

    setMessages((prev) => [...prev, { sender: "user", text: destination }])

    const data = getCampusData()
    const path = data.findPath(currentLocation, destination)

    if (path) {
      setCurrentPath(path)
      setCurrentStep(0)

      // Start giving directions
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: t("helpGetFrom", {
            from: currentLocation,
            to: destination,
            direction: path.directions[0],
          }),
        },
      ])

      setShowNavigationControls(true)

      // Check if the first step is a milestone
      const milestoneText = language === "en" ? "milestone" : language === "hi" ? "मील का पत्थर" : "మైలురాయి"
      if (path.directions[0].includes(`(${milestoneText})`)) {
        setWaitingForMilestone(true)
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: t("reachedLandmark"),
          },
        ])
      } else {
        setWaitingForMilestone(false)
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: t("completedStep"),
          },
        ])
      }

      setConversationState("giving_directions")
    } else {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: t("noPathFound", { from: currentLocation, to: destination }),
        },
      ])
      setShowDestinationSelection(true)
    }
  }

  // Handle next direction
  const handleNextDirection = () => {
    // Move to next direction
    const nextStep = currentStep + 1

    if (nextStep < currentPath.directions.length) {
      setCurrentStep(nextStep)
      const nextDirection = currentPath.directions[nextStep]

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: nextDirection,
        },
      ])

      // Check if this step is a milestone
      const milestoneText = language === "en" ? "milestone" : language === "hi" ? "मील का पत्थर" : "మైలురాయి"
      if (nextDirection.includes(`(${milestoneText})`)) {
        setWaitingForMilestone(true)
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: t("reachedLandmark"),
          },
        ])
      } else {
        setWaitingForMilestone(false)
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: t("completedStep"),
          },
        ])
      }
    } else {
      // Reached destination
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: t("reachedDestination", { destination }),
        },
      ])

      setCurrentLocation(destination)
      setDestination("")
      setCurrentPath(null)
      setCurrentStep(0)
      setConversationState("asking_destination")
      setShowNavigationControls(false)
      setShowEndOptions(true)
    }
  }

  // Handle milestone reached
  const handleMilestoneReached = () => {
    setWaitingForMilestone(false)

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: t("reachedLandmarkBtn") },
      { sender: "bot", text: t("continueDirection") },
    ])

    // Move to next direction
    handleNextDirection()
  }

  // Handle new directions
  const handleNewDirections = () => {
    setShowEndOptions(false)
    setShowDestinationSelection(true)

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: t("selectDestination"),
      },
    ])
  }

  // Handle end chat
  const handleEndChat = () => {
    setShowEndOptions(false)

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: t("endNavigation") },
      { sender: "bot", text: t("thankYou") },
    ])

    // Reset after a delay
    setTimeout(() => {
      resetConversation()
    }, 3000)
  }

  // Reset conversation
  const resetConversation = () => {
    setMessages([
      {
        sender: "bot",
        text: t("welcomeMessage"),
      },
    ])
    setCurrentLocation("")
    setDestination("")
    setCurrentPath(null)
    setCurrentStep(0)
    setWaitingForMilestone(false)
    setConversationState("asking_location")
    setShowLocationSelection(true)
    setShowDestinationSelection(false)
    setShowNavigationControls(false)
    setShowEndOptions(false)
    setLocationFilter("")
    setDestinationFilter("")
  }

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)

    // Update filters based on conversation state
    if (showLocationSelection) {
      setLocationFilter(value)
    } else if (showDestinationSelection) {
      setDestinationFilter(value)
    }
  }

  // Process text input for chat
  const processTextInput = (text) => {
    const data = getCampusData()
    const lowerText = text.toLowerCase()

    // Check for greetings
    const greetings = ["hi", "hello", "hey", "greetings", "howdy"]
    if (greetings.some((greeting) => lowerText === greeting || lowerText.startsWith(`${greeting} `))) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `${t("welcomeMessage")} ${showLocationSelection ? t("selectLocation") : showDestinationSelection ? t("selectDestination") : ""}`,
        },
      ])
      return
    }

    // Check if input matches a location
    if (showLocationSelection) {
      const matchedLocation = data.locations.find(
        (loc) => loc.toLowerCase() === lowerText || loc.toLowerCase().includes(lowerText),
      )

      if (matchedLocation) {
        handleLocationSelect(matchedLocation)
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `I couldn't find "${text}" in the available locations. Please select from the list or try another location.`,
          },
        ])
      }
    }
    // Check if input matches a destination
    else if (showDestinationSelection) {
      const matchedDestination = data.locations.find(
        (loc) => loc !== currentLocation && (loc.toLowerCase() === lowerText || loc.toLowerCase().includes(lowerText)),
      )

      if (matchedDestination) {
        handleDestinationSelect(matchedDestination)
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `I couldn't find "${text}" as a destination. Please select from the list or try another destination.`,
          },
        ])
      }
    }
    // Handle other inputs during navigation
    else if (showNavigationControls) {
      const nextStepPhrases = ["next", "continue", "next step", "next direction"]
      const reachedPhrases = ["reached", "i reached", "arrived", "i arrived", "i am here", "i'm here"]

      if (nextStepPhrases.some((phrase) => lowerText.includes(phrase))) {
        if (!waitingForMilestone) {
          handleNextDirection()
        }
      } else if (reachedPhrases.some((phrase) => lowerText.includes(phrase))) {
        if (waitingForMilestone) {
          handleMilestoneReached()
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Please use the navigation controls to continue your journey." },
        ])
      }
    }
    // Handle inputs at the end of navigation
    else if (showEndOptions) {
      const newDirectionPhrases = ["new", "another", "different", "somewhere else"]
      const endPhrases = ["end", "finish", "stop", "quit", "exit", "bye", "goodbye"]

      if (newDirectionPhrases.some((phrase) => lowerText.includes(phrase))) {
        handleNewDirections()
      } else if (endPhrases.some((phrase) => lowerText.includes(phrase))) {
        handleEndChat()
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Would you like to get directions to somewhere else or end the navigation?" },
        ])
      }
    }
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message to chat
    setMessages((prev) => [...prev, { sender: "user", text: input }])

    // Process the input
    processTextInput(input)

    // Clear input field
    setInput("")
  }

  // Get current campus data
  const data = getCampusData()

  // Filter available destinations (exclude current location)
  const availableDestinations = data.locations.filter((loc) => loc !== currentLocation)

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-xl relative">
        <LanguageSwitcher />

        <CardHeader className="bg-primary/5 border-b">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <Navigation className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>{t("appTitle")}</CardTitle>
              <CardDescription>{t("appDescription")}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 max-h-[60vh] overflow-y-auto scroll-pt-4" id="message-container">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <Message key={index} message={message.text} isUser={message.sender === "user"} />
            ))}
            <div ref={messagesEndRef} className="h-1" />

            {/* Location Selection */}
            {showLocationSelection && (
              <div className="mt-4 animate-fadeIn">
                <p className="text-sm font-medium mb-2">{t("selectLocation")}</p>
                <LocationButtonGrid
                  locations={data.locations}
                  onSelect={handleLocationSelect}
                  filterText={locationFilter}
                />
              </div>
            )}

            {/* Destination Selection */}
            {showDestinationSelection && (
              <div className="mt-4 animate-fadeIn">
                <p className="text-sm font-medium mb-2">{t("selectDestination")}</p>
                <LocationButtonGrid
                  locations={availableDestinations}
                  onSelect={handleDestinationSelect}
                  filterText={destinationFilter}
                />
              </div>
            )}

            {/* Navigation Controls */}
            {showNavigationControls && currentPath && (
              <div className="mt-4 animate-fadeIn">
                <ProgressIndicator currentStep={currentStep + 1} totalSteps={currentPath.directions.length} />
                <NavigationControls
                  onNext={handleNextDirection}
                  onMilestoneReached={handleMilestoneReached}
                  isWaitingForMilestone={waitingForMilestone}
                />
              </div>
            )}

            {/* End Options */}
            {showEndOptions && (
              <div className="mt-4 animate-fadeIn">
                <EndNavigationOptions onNewDirections={handleNewDirections} onEndChat={handleEndChat} />
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              type="text"
              placeholder={t("typeMessage")}
              value={input}
              onChange={handleInputChange}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>

        {/* Status Bar */}
        {currentLocation && (
          <div className="px-4 py-2 border-t bg-muted/50 text-xs text-muted-foreground flex items-center">
            <Badge variant="outline" className="mr-2">
              <MapPin className="h-3 w-3 mr-1" />
              {currentLocation}
            </Badge>
            {destination && (
              <>
                <span className="mx-1">→</span>
                <Badge variant="outline">
                  <MapPin className="h-3 w-3 mr-1" />
                  {destination}
                </Badge>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

export default function Page() {
  return (
    <LanguageProvider>
      <CampusNavigationBot />
    </LanguageProvider>
  )
}

