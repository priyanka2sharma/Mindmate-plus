"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { UserAvatar } from "@/components/user-avatar"
import { MainNav } from "@/components/main-nav"
import { Trash, FileText, Calendar } from "lucide-react"

type JournalEntry = {
  id: string
  content: string
  sentiment: "positive" | "neutral" | "negative"
  analysis: string
  date: Date
}

const SAMPLE_ENTRIES: JournalEntry[] = [
  {
    id: "1",
    content: "Today was a good day. I managed to complete all my tasks and even had time for a short walk in the park.",
    sentiment: "positive",
    analysis: "You seem to be feeling accomplished and balanced. Great job on making time for self-care!",
    date: new Date(Date.now() - 86400000), // Yesterday
  },
  {
    id: "2",
    content: "Feeling a bit overwhelmed with work. There's so much to do and I'm not sure if I can handle it all.",
    sentiment: "negative",
    analysis:
      "You're experiencing some stress related to work responsibilities. Consider breaking tasks into smaller steps and prioritizing self-care.",
    date: new Date(Date.now() - 86400000 * 3), // 3 days ago
  },
]

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(SAMPLE_ENTRIES)
  const [currentEntry, setCurrentEntry] = useState("")
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSaveEntry = () => {
    if (!currentEntry.trim()) return

    setIsAnalyzing(true)

    // Simulate AI analysis
    setTimeout(() => {
      // Simple sentiment analysis based on keywords
      let sentiment: "positive" | "neutral" | "negative" = "neutral"
      let analysis = ""

      const positiveWords = ["good", "great", "happy", "joy", "excited", "wonderful", "accomplished"]
      const negativeWords = ["sad", "angry", "frustrated", "anxious", "worried", "stressed", "overwhelmed"]

      const lowerCaseEntry = currentEntry.toLowerCase()

      const positiveCount = positiveWords.filter((word) => lowerCaseEntry.includes(word)).length
      const negativeCount = negativeWords.filter((word) => lowerCaseEntry.includes(word)).length

      if (positiveCount > negativeCount) {
        sentiment = "positive"
        analysis =
          "Your entry has a positive tone. You seem to be in good spirits. What specific moments brought you joy today?"
      } else if (negativeCount > positiveCount) {
        sentiment = "negative"
        analysis =
          "I notice some challenging emotions in your entry. Remember that it's okay to feel this way. Would you like some suggestions to help improve your mood?"
      } else {
        sentiment = "neutral"
        analysis = "Your entry seems balanced. How would you describe your overall mood today?"
      }

      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        content: currentEntry,
        sentiment,
        analysis,
        date: new Date(),
      }

      setEntries([newEntry, ...entries])
      setCurrentEntry("")
      setSelectedEntry(newEntry)
      setAiAnalysis(analysis)
      setIsAnalyzing(false)
    }, 1500)
  }

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id))
    if (selectedEntry?.id === id) {
      setSelectedEntry(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <MainNav />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle className="text-xl text-blue-700">Journal Entry</CardTitle>
                <CardDescription>Write about your thoughts, feelings, or experiences</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="How are you feeling today? What's on your mind?"
                  className="min-h-[200px] resize-none"
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" onClick={() => setCurrentEntry("")}>
                  Clear
                </Button>
                <Button
                  onClick={handleSaveEntry}
                  disabled={!currentEntry.trim() || isAnalyzing}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isAnalyzing ? "Analyzing..." : "Save Entry"}
                </Button>
              </CardFooter>
            </Card>

            {selectedEntry && (
              <Card className="mt-6 bg-white/90 backdrop-blur-sm border-blue-100">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-blue-700">AI Analysis</CardTitle>
                    <div
                      className={`px-2 py-1 rounded-full text-sm ${
                        selectedEntry.sentiment === "positive"
                          ? "bg-green-100 text-green-700"
                          : selectedEntry.sentiment === "negative"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {selectedEntry.sentiment.charAt(0).toUpperCase() + selectedEntry.sentiment.slice(1)}
                    </div>
                  </div>
                  <CardDescription>Based on your journal entry</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <UserAvatar className="h-10 w-10" />
                    <div className="bg-blue-50 rounded-lg p-3 flex-1">
                      <p className="text-gray-700">{selectedEntry.analysis}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="bg-white/90 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle className="text-xl text-blue-700">Previous Entries</CardTitle>
                <CardDescription>Your journal history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {entries.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No entries yet</p>
                  ) : (
                    entries.map((entry) => (
                      <div
                        key={entry.id}
                        className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedEntry?.id === entry.id ? "border-blue-300 bg-blue-50" : "border-gray-200"
                        }`}
                        onClick={() => setSelectedEntry(entry)}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">
                              {entry.content.substring(0, 30)}
                              {entry.content.length > 30 ? "..." : ""}
                            </span>
                          </div>
                          <div
                            className={`w-3 h-3 rounded-full ${
                              entry.sentiment === "positive"
                                ? "bg-green-400"
                                : entry.sentiment === "negative"
                                  ? "bg-red-400"
                                  : "bg-gray-400"
                            }`}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {entry.date.toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: entry.date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
                              })}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-400 hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteEntry(entry.id)
                            }}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
