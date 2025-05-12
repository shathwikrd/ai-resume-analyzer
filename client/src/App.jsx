import { useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { styled } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#9c27b0",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
  },
});

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function App() {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e) {
    setFile(e.target.files[0]);
    setFeedback(null);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    setLoading(true);
    setError("");
    setFeedback(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback(data);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Network error or server not reachable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h3" gutterBottom align="center" fontWeight="bold">
          AI Resume Analyzer
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            mb={3}
          >
            <Button
              component="label"
              variant="contained"
              startIcon={<FileUploadIcon />}
            >
              Upload PDF
              <VisuallyHiddenInput
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </Button>

            {file && (
              <Typography variant="body1" color="text.secondary">
                {file.name}
              </Typography>
            )}

            <Button type="submit" variant="contained" color="secondary">
              Submit
            </Button>
          </Box>
        </form>

        {loading && (
          <Box textAlign="center" mt={3}>
            <CircularProgress />
            <Typography>Analyzing your resume...</Typography>
          </Box>
        )}

        {error && (
          <Typography color="error" mt={2}>
            ❌ {error}
          </Typography>
        )}

        {feedback && (
          <Card elevation={4} sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Resume Feedback
              </Typography>

              <Typography>
                <strong>Summary:</strong> {feedback.summary}
              </Typography>
              <Typography>
                <strong>Score:</strong> {feedback.score}/100
              </Typography>
              <Typography>
                <strong>Job Readiness:</strong> {feedback.jobReadiness}
              </Typography>

              <Section
                title="✔️ Strengths"
                items={feedback.strengths}
                icon={<ThumbUpIcon />}
              />
              <Section
                title="⚠️ Weaknesses"
                items={feedback.weaknesses}
                icon={<WarningIcon />}
              />
              <Section
                title="💡 Suggestions"
                items={feedback.suggestions}
                icon={<CheckCircleIcon />}
              />
              <Section
                title="🚫 Issues"
                items={feedback.issues}
                icon={<ReportProblemIcon />}
              />
            </CardContent>
          </Card>
        )}
      </Container>
    </ThemeProvider>
  );
}

function Section({ title, items, icon }) {
  return (
    <>
      <Typography variant="h6" mt={3}>
        {title}
      </Typography>
      <List>
        {items.map((item, index) => (
          <ListItem key={index}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default App;
