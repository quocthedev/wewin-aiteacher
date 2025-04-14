import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

const formalExample = {
  english: [
    { word: "Do" },
    { word: "you" },
    { word: "live" },
    { word: "in" },
    { word: "America" },
    { word: "?" },
  ],
  grammarBreakdown: [
    {
      vietnamese: "Bạn có sống ở Mỹ không?",
      english: [
        { word: "Do" },
        { word: "you" },
        { word: "live" },
        { word: "in" },
        { word: "America" },
        { word: "?" },
      ],
      chunks: [
        {
          english: [{ word: "Do" }],
          meaning: "used to form a question",
          grammar: "Auxiliary Verb",
        },
        {
          english: [{ word: "you" }],
          meaning: "the person being spoken to",
          grammar: "Pronoun",
        },
        {
          english: [{ word: "live" }],
          meaning: "to reside",
          grammar: "Main Verb",
        },
        {
          english: [{ word: "in" }],
          meaning: "indicating location",
          grammar: "Preposition",
        },
        {
          english: [{ word: "America" }],
          meaning: "a country in North America",
          grammar: "Proper Noun",
        },
        {
          english: [{ word: "?" }],
          meaning: "question punctuation",
          grammar: "Punctuation",
        },
      ],
    },
  ],
};

const casualExample = {
  english: [
    { word: "Do" },
    { word: "you" },
    { word: "live" },
    { word: "in" },
    { word: "America" },
    { word: "?" },
  ],
  grammarBreakdown: [
    {
      vietnamese: "Bạn có sống ở Mỹ không?",
      englishWords: [
        { word: "Do" },
        { word: "you" },
        { word: "live" },
        { word: "in" },
        { word: "America" },
        { word: "?" },
      ],
      chunks: [
        {
          english: [{ word: "Do" }],
          meaning: "used to form a question",
          grammar: "Auxiliary Verb",
        },
        {
          english: [{ word: "you" }],
          meaning: "the person being spoken to",
          grammar: "Pronoun",
        },
        {
          english: [{ word: "live" }],
          meaning: "to reside",
          grammar: "Main Verb",
        },
        {
          english: [{ word: "in" }],
          meaning: "indicating location",
          grammar: "Preposition",
        },
        {
          english: [{ word: "America" }],
          meaning: "a country in North America",
          grammar: "Proper Noun",
        },
        {
          english: [{ word: "?" }],
          meaning: "question punctuation",
          grammar: "Punctuation",
        },
      ],
    },
  ],
};

export async function GET(req) {
  // WARNING: Do not expose your keys
  // WARNING: If you host publicly your project, add an authentication layer to limit the consumption of ChatGPT resources

  const speech = req.nextUrl.searchParams.get("speech") || "formal";
  const speechExample = speech === "formal" ? formalExample : casualExample;

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a English language teacher. 
Your student asks you how to say something from vietnamese to english.
You should respond with: 
- vietnamese: the vietnamese version ex: "Bạn có sống ở nhật không?"
- english: the english translation in split into words ex: ${JSON.stringify(
          speechExample.english
        )}
- grammarBreakdown: an explanation of the grammar structure per sentence ex: ${JSON.stringify(
          speechExample.grammarBreakdown
        )}
`,
      },
      {
        role: "system",
        content: `You always respond with a JSON object with the following format: 
        {
          "vietnamese": "",
          "english": [{
            "word": "",
            "reading": ""
          }],
          "grammarBreakdown": [{
            "vietnamese": "",
            "english": [{
              "word": "",
              "reading": ""
            }],
            "chunks": [{
              "english": [{
                "word": "",
                "reading": ""
              }],
              "meaning": "",
              "grammar": ""
            }]
          }]
        }`,
      },
      {
        role: "user",
        content: `How to say ${
          req.nextUrl.searchParams.get("question") ||
          "Bạn có bao giờ đi nước ngoài?"
        } in English in ${speech} speech?`,
      },
    ],
    // model: "gpt-4-turbo-preview", // https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
    model: "gpt-3.5-turbo", // https://help.openai.com/en/articles/7102672-how-can-i-access-gpt-4
    response_format: {
      type: "json_object",
    },
  });
  console.log(chatCompletion.choices[0].message.content);
  return Response.json(JSON.parse(chatCompletion.choices[0].message.content));
}
