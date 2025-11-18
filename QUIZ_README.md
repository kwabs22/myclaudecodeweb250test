# AI Engineer Phase 1 Quiz System - 1000 Questions

A comprehensive quiz application with 1000 questions testing Phase 1 fundamentals: Linear Algebra, Calculus, Probability & Statistics, Python, SQL, and Data Structures & Algorithms.

## 📊 Overview

- **Total Questions**: 1000
- **Topics**: 6 major areas
- **Difficulty Levels**: Beginner, Intermediate, Advanced
- **Question Types**: Multiple choice, coding challenges, true/false

## 📂 Files

### Core Files

1. **phase1-question-bank-full.json** (384 KB)
   - Complete question bank with all 1000 questions
   - JSON format for easy parsing and integration
   - Includes metadata, explanations, and hints

2. **generate_full_question_bank.py**
   - Python script to generate the question bank
   - Easily modifiable to add more questions
   - Organized by topic with clear structure

3. **quiz-app.html**
   - Standalone HTML quiz application
   - Works directly in any modern browser
   - No build process or dependencies required
   - Full-featured UI with progress tracking

4. **QuizApp.jsx**
   - React component version
   - For integration into React applications
   - Uses Tailwind CSS and Lucide icons

## 🚀 Quick Start

### Option 1: Standalone HTML (Easiest)

```bash
# Simply open the HTML file in your browser
open quiz-app.html
# or
firefox quiz-app.html
# or
chrome quiz-app.html
```

**Features**:
- ✅ No installation required
- ✅ Works offline after first load
- ✅ Progress tracking
- ✅ Statistics by topic
- ✅ Keyboard navigation (←/→ arrows, 1-4 for answers)
- ✅ Filter by topic and difficulty
- ✅ Beautiful responsive UI

### Option 2: React Component

```jsx
import QuizApp from './QuizApp';

function App() {
  return <QuizApp />;
}
```

**Requirements**:
- React
- Tailwind CSS
- Lucide React icons

### Option 3: Generate Custom Questions

```bash
# Run the generator script
python generate_full_question_bank.py

# Output: phase1-question-bank-full.json
```

Modify the script to:
- Add more questions
- Change difficulty distribution
- Add new topics
- Customize question formats

## 📚 Question Breakdown

| Topic | Questions | Subtopics |
|-------|-----------|-----------|
| **Linear Algebra** | 200 | Vectors, Matrices, Transformations, Eigenvalues |
| **Calculus** | 150 | Derivatives, Chain Rule, Gradients, Optimization |
| **Probability & Statistics** | 150 | Probability, Distributions, Statistics, Hypothesis Testing |
| **Python** | 200 | Basics, NumPy, Pandas, Matplotlib |
| **SQL** | 150 | SELECT, WHERE, JOIN, GROUP BY, Subqueries |
| **DSA** | 150 | Arrays, Linked Lists, Trees, Graphs, Sorting, Searching |

## 🎯 Features

### 1. Smart Filtering
```javascript
// Filter by topic
- All Topics (1000 questions)
- Linear Algebra (200)
- Calculus (150)
- Probability & Statistics (150)
- Python (200)
- SQL (150)
- DSA (150)

// Filter by difficulty
- All Difficulties
- Beginner
- Intermediate
- Advanced
```

### 2. Progress Tracking
- Visual progress bar
- Questions answered count
- Correct/Incorrect ratio
- Real-time accuracy percentage

### 3. Statistics Dashboard
- Overall performance metrics
- Per-topic performance breakdown
- Visual progress bars
- Accuracy percentages

### 4. Rich Question Format
```json
{
  "id": 1,
  "topic": "linear_algebra",
  "subtopic": "vectors",
  "difficulty": "beginner",
  "type": "multiple_choice",
  "question": "What is a vector?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answer": 0,
  "explanation": "Detailed explanation of the answer",
  "hints": ["Helpful hint for solving"]
}
```

### 5. Keyboard Shortcuts
- **← / →**: Navigate between questions
- **1-4**: Select answer options
- **Enter**: Next question (after answering)

## 🎨 UI Features

### Color-Coded Feedback
- ✅ **Green**: Correct answers
- ❌ **Red**: Incorrect answers
- 🔵 **Blue**: Selected but not yet confirmed
- ⚪ **Gray**: Unselected options

### Difficulty Badges
- 🟢 **Beginner**: Green badge
- 🟡 **Intermediate**: Yellow badge
- 🔴 **Advanced**: Red badge

### Topic Labels
- Visual badges showing current topic and subtopic
- Easy identification of question categories

## 📖 Usage Examples

### Example 1: Take Full Quiz
1. Open `quiz-app.html`
2. Select "All Topics" and "All Difficulties"
3. Answer all 1000 questions
4. Check statistics to see your performance

### Example 2: Focus on Weak Areas
1. Open quiz app
2. Filter by specific topic (e.g., "Calculus")
3. Filter by difficulty (e.g., "Advanced")
4. Practice only those questions

### Example 3: Daily Practice
1. Use filters to select a subset of questions
2. Answer 20-50 questions per day
3. Track progress over time

### Example 4: Integrate into Your App

```javascript
// Load questions
fetch('phase1-question-bank-full.json')
  .then(res => res.json())
  .then(data => {
    const questions = data.questions;
    // Use questions in your app
  });
```

## 🛠️ Customization

### Modify Question Generation

Edit `generate_full_question_bank.py`:

```python
def generate_custom_topic_questions(self, count):
    """Add your custom topic"""
    questions = []
    for i in range(count):
        questions.append(self._create_mc_question(
            topic="custom_topic",
            subtopic="custom_subtopic",
            difficulty="beginner",
            question=f"Your question {i}",
            options=["A", "B", "C", "D"],
            correct=0,
            explanation="Your explanation"
        ))
    return questions
```

### Modify UI Styling

The HTML file uses Tailwind CSS. Modify classes:

```html
<!-- Change colors -->
<div class="bg-blue-600">  <!-- Change to bg-purple-600 -->

<!-- Change sizes -->
<button class="px-6 py-3">  <!-- Change to px-8 py-4 -->
```

### Add New Features

Add to the JavaScript section:

```javascript
// Example: Shuffle questions
function shuffleQuestions() {
    filteredQuestions = filteredQuestions
        .sort(() => Math.random() - 0.5);
    renderQuestion();
}

// Example: Timed mode
let timeLeft = 60;
function startTimer() {
    setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) nextQuestion();
    }, 1000);
}
```

## 📊 Data Format

### Question Object Structure

```typescript
interface Question {
  id: number;
  topic: string;
  subtopic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  type: "multiple_choice" | "coding" | "true_false" | "fill_blank";
  question: string;
  options?: string[];  // For multiple choice
  correct_answer: number | string;
  explanation: string;
  hints?: string[];
  code_template?: string;  // For coding questions
  test_cases?: TestCase[];  // For coding questions
}
```

### Metadata Structure

```typescript
interface Metadata {
  title: string;
  version: string;
  total_questions: number;
  created: string;
  description: string;
  topics: {
    [key: string]: number;
  };
  difficulty_levels: string[];
  question_types: string[];
}
```

## 🎓 Learning Strategy

### Recommended Approach

**Week 1-2: Beginner Questions**
- Filter by "Beginner" difficulty
- Complete all topics
- Build confidence with fundamentals

**Week 3-4: Intermediate Questions**
- Filter by "Intermediate" difficulty
- Focus on weaker topics first
- Review explanations carefully

**Week 5-6: Advanced Questions**
- Filter by "Advanced" difficulty
- Take your time
- Study hints and explanations

**Week 7-8: Mixed Review**
- All difficulties, all topics
- Track improvement over time
- Aim for 80%+ accuracy

### Daily Practice Schedule

**20 minutes/day**:
- 10 questions per session
- Review all explanations
- Note weak areas

**1 hour/day**:
- 50 questions per session
- Detailed review
- Additional research on missed topics

**3 hours/day (intensive)**:
- 150 questions per session
- Complete one topic per day
- Deep dive into weak areas

## 📈 Performance Benchmarks

### Skill Levels

**Beginner** (0-50% accuracy):
- Still learning fundamentals
- Review explanations carefully
- Consider additional resources

**Intermediate** (50-75% accuracy):
- Good grasp of concepts
- Practice more difficult questions
- Focus on weak topics

**Advanced** (75-90% accuracy):
- Strong understanding
- Ready for real-world applications
- Help others learn

**Expert** (90%+ accuracy):
- Mastery of Phase 1 fundamentals
- Ready for Phase 2
- Consider creating teaching content

## 🔧 Troubleshooting

### Question Bank Not Loading

```bash
# Make sure files are in the same directory
ls quiz-app.html phase1-question-bank-full.json

# Check file permissions
chmod 644 phase1-question-bank-full.json

# Test JSON validity
python -m json.tool phase1-question-bank-full.json
```

### UI Not Displaying Correctly

1. **Check browser compatibility**: Use modern browser (Chrome, Firefox, Safari, Edge)
2. **Clear cache**: Hard refresh with Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. **Check console**: Open Developer Tools (F12) and check for errors

### Generator Script Errors

```bash
# Check Python version (requires 3.6+)
python --version

# Run with verbose output
python -v generate_full_question_bank.py

# Check JSON output
python -c "import json; json.load(open('phase1-question-bank-full.json'))"
```

## 🚀 Advanced Features (TODO)

### Future Enhancements

- [ ] Spaced repetition algorithm
- [ ] Performance analytics over time
- [ ] Export results to CSV
- [ ] Share results with others
- [ ] Leaderboard functionality
- [ ] Timed quiz mode
- [ ] Adaptive difficulty
- [ ] Study mode vs Test mode
- [ ] Bookmark difficult questions
- [ ] Notes on each question

## 📝 Contributing

### Add New Questions

1. Edit `generate_full_question_bank.py`
2. Add questions to relevant topic function
3. Run script to regenerate JSON
4. Test in quiz app

### Report Issues

Found a mistake in a question?
1. Note the question ID
2. Document the issue
3. Submit correction

### Improve UI

1. Edit `quiz-app.html`
2. Test in multiple browsers
3. Ensure responsive design
4. Submit changes

## 📄 License

This question bank is created for educational purposes and is part of the AI Engineer Roadmap project.

## 🙏 Acknowledgments

- Based on the "God Tier" AI Engineer Roadmap
- Question topics aligned with industry standards
- Curated to match skills needed for AI Engineering

## 📞 Support

For questions or issues:
1. Check this README first
2. Review the code comments
3. Test with a simple example
4. Document and report issues

---

**Last Updated**: 2025-11-18
**Version**: 1.0.0
**Total Questions**: 1000
**Status**: Ready for use ✅

**Happy Learning! 🚀📚**
