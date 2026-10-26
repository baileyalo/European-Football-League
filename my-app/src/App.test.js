import React from 'react';
import { createRoot } from 'react-dom/client';
import { render, screen, act, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock hooks to control loading, error, and data states
const mockRetry = jest.fn();
jest.mock('./hooks/useTheme', () => ({
  useTheme: () => ({
    isDarkMode: false,
    toggleTheme: jest.fn(),
  }),
}));
jest.mock('./hooks/useStandings', () => ({
  useStandings: jest.fn(),
}));
jest.mock('./api/footballApi', () => ({
  fetchStandings: jest.fn(),
  fetchTeam: jest.fn(),
  fetchScorers: jest.fn(),
}));

const { useStandings } = require('./hooks/useStandings');
const { fetchTeam, fetchScorers } = require('./api/footballApi');

const mockStandings = [
  {
    position: 1,
    team: { id: 1, name: 'Team A', shortName: 'TA', tla: 'TA', crest: 'http://crest.a' },
    playedGames: 10,
    won: 8,
    draw: 1,
    lost: 1,
    goalsFor: 20,
    goalsAgainst: 5,
    goalDifference: 15,
    points: 25,
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  useStandings.mockReturnValue({
    leagueName: 'Premier League',
    standings: mockStandings,
    isLoading: false,
    error: null,
    retry: mockRetry,
  });
  fetchTeam.mockResolvedValue({
    data: {
      id: 1,
      name: 'Team A',
      crest: 'https://crest.a',
      website: 'https://teama.example.com',
      venue: 'Team A Stadium',
      coach: { name: 'Coach Smith' },
      squad: [
        { name: 'Player One', position: 'Goalkeeper', shirtNumber: 1 },
        { name: 'Player Two', position: 'Defence', shirtNumber: 2 },
      ],
    },
    error: null,
  });
  fetchScorers.mockImplementation(() => new Promise(() => {}));
});

function mockScorersWithTopScorer() {
  fetchScorers.mockResolvedValue({
    data: [{ player: { name: 'Star Striker' }, team: { id: 1 }, goals: 14 }],
    error: null,
  });
}

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  act(() => {
    root.render(<App />);
  });
  act(() => {
    root.unmount();
  });
});

it('displays main title and subtitle', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    process.env.REACT_APP_APP_NAME || 'Football Standings'
  );
  expect(screen.getByText(/Live football standings/)).toBeInTheDocument();
});

it('shows loading state when isLoading is true', () => {
  useStandings.mockReturnValue({
    leagueName: '',
    standings: null,
    isLoading: true,
    error: null,
    retry: mockRetry,
  });
  render(<App />);
  expect(screen.getByText(/Loading standings/)).toBeInTheDocument();
});

it('shows error state with message and retry button when error is set', async () => {
  useStandings.mockReturnValue({
    leagueName: '',
    standings: null,
    isLoading: false,
    error: 'Network error',
    retry: mockRetry,
  });
  render(<App />);
  expect(screen.getByText(/Couldn’t load standings/)).toBeInTheDocument();
  expect(screen.getByText(/Network error/)).toBeInTheDocument();
  const retryButton = screen.getByRole('button', { name: /Try Again/i });
  expect(retryButton).toBeInTheDocument();
  await userEvent.click(retryButton);
  expect(mockRetry).toHaveBeenCalledTimes(1);
});

it('shows standings content when data is loaded', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /Premier League/i })).toBeInTheDocument();
  expect(screen.getByText('Team A')).toBeInTheDocument();
});

it('renders league selection buttons', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /Premier League/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /La Liga/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Bundesliga/i })).toBeInTheDocument();
});

it('renders season selection buttons', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: '2024' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '2025' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '2026' })).toBeInTheDocument();
});

it('calls useStandings with initial league and season', () => {
  render(<App />);
  expect(useStandings).toHaveBeenCalledWith('PL', '2026');
});

it('displays Season heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /^Season$/i })).toBeInTheDocument();
});

it('team name opens team detail sheet; Visit website opens team site', async () => {
  const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
  render(<App />);
  const teamNameButton = screen.getByRole('button', { name: /View details for Team A/i });
  await userEvent.click(teamNameButton);
  expect(fetchTeam).toHaveBeenCalledWith(1);
  await waitFor(() => {
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    const inDialog = within(dialog);
    expect(inDialog.getByRole('heading', { name: 'Team A' })).toBeInTheDocument();
    expect(inDialog.getByText('Team A Stadium')).toBeInTheDocument();
    expect(inDialog.getByText('Coach Smith')).toBeInTheDocument();
  });
  const visitWebsiteBtn = screen.getByRole('button', { name: /Visit website/i });
  await userEvent.click(visitWebsiteBtn);
  expect(openSpy).toHaveBeenCalledWith(
    'https://teama.example.com',
    '_blank',
    'noopener,noreferrer'
  );
  openSpy.mockRestore();
});

it('shows top scorer in team detail when scorers API returns data for that team', async () => {
  mockScorersWithTopScorer();
  render(<App />);
  const teamNameButton = screen.getByRole('button', { name: /View details for Team A/i });
  await userEvent.click(teamNameButton);
  await waitFor(() => {
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/Star Striker/)).toBeInTheDocument();
    expect(within(dialog).getByText(/14 goals/)).toBeInTheDocument();
  });
});

it('loads the selected league and season', async () => {
  render(<App />);
  expect(screen.getByRole('button', { name: '2026' })).toHaveAttribute('aria-pressed', 'true');

  await userEvent.click(screen.getByRole('button', { name: 'La Liga' }));
  expect(useStandings).toHaveBeenLastCalledWith('PD', '2026');

  await userEvent.click(screen.getByRole('button', { name: '2024' }));
  expect(useStandings).toHaveBeenLastCalledWith('PD', '2024');
});

it('shows position, matches played, and points for each team', () => {
  render(<App />);
  const row = screen.getByRole('row', { name: /Team A/i });
  const cells = within(row).getAllByRole('cell');
  expect(cells[0]).toHaveTextContent('1');
  expect(cells[2]).toHaveTextContent('10');
  expect(cells[9]).toHaveTextContent('25');
});

it('shows an empty standings message when the table has no rows', () => {
  useStandings.mockReturnValue({
    leagueName: 'Premier League',
    standings: [],
    isLoading: false,
    error: null,
    retry: mockRetry,
  });
  render(<App />);
  expect(screen.getByText(/No standings for this league and season/)).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /View details/i })).not.toBeInTheDocument();
});

it('shows a team load failure in the detail sheet', async () => {
  const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
  fetchTeam.mockResolvedValue({ data: null, error: 'Team unavailable' });
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /View details for Team A/i }));
  const dialog = await screen.findByRole('dialog', { name: /Couldn’t load team/i });
  expect(within(dialog).getByText(/Team unavailable/)).toBeInTheDocument();
  expect(openSpy).not.toHaveBeenCalled();
  openSpy.mockRestore();
});

it('shows that a team has no website instead of opening a tab', async () => {
  const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
  fetchTeam.mockResolvedValue({
    data: {
      id: 1,
      name: 'Team A',
      crest: null,
      website: null,
      venue: null,
      coach: null,
      squad: [],
    },
    error: null,
  });
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /View details for Team A/i }));
  const dialog = await screen.findByRole('dialog', { name: 'Team A' });
  expect(within(dialog).getByText(/No website available/)).toBeInTheDocument();
  expect(within(dialog).queryByRole('button', { name: /Visit website/i })).not.toBeInTheDocument();
  expect(openSpy).not.toHaveBeenCalled();
  openSpy.mockRestore();
});

it('closes the team detail sheet when Escape is pressed', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /View details for Team A/i }));
  expect(await screen.findByRole('dialog')).toBeInTheDocument();
  await userEvent.keyboard('{Escape}');
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
