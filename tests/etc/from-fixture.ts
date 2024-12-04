import { InvalidTestCase, SuggestionOutput, TestCaseError } from '@typescript-eslint/rule-tester';
import { TSESLint } from '@typescript-eslint/utils';

export function fromFixture<
  TMessageIds extends string,
>(
  fixture: string,
  invalidTestCase?: {
    output?: string;
    suggestions?: readonly SuggestionOutput<TMessageIds>[] | null;
  },
): InvalidTestCase<TMessageIds, never>;
export function fromFixture<
  TMessageIds extends string,
  TOptions extends readonly unknown[],
>(
  fixture: string,
  invalidTestCase: Omit<
    InvalidTestCase<TMessageIds, TOptions>,
    'code' | 'errors'
  > & {
    suggestions?: readonly SuggestionOutput<TMessageIds>[] | null;
  }
): InvalidTestCase<TMessageIds, TOptions>;
export function fromFixture<
  TMessageIds extends string,
  TOptions extends readonly unknown[],
>(
  fixture: string,
  invalidTestCase: Omit<
    InvalidTestCase<TMessageIds, TOptions>,
    'code' | 'errors'
  > & {
    suggestions?: readonly SuggestionOutput<TMessageIds>[] | null;
  } = {},
): InvalidTestCase<TMessageIds, TOptions> {
  const { suggestions, ...rest } = invalidTestCase;
  return {
    ...rest,
    ...parseFixture(fixture, suggestions),
  };
}

function getSuggestions<TMessageIds extends string>(
  suggestions:
    | readonly SuggestionOutput<TMessageIds>[]
    | null
    | undefined,
  suggest: boolean,
  indices: string | undefined,
) {
  if (!suggestions || !suggest) {
    return {};
  }
  if (!indices) {
    return { suggestions } as const;
  }
  return {
    suggestions: indices
      .split(/\s+/)
      .map((index) => suggestions[Number.parseInt(index, 10)]),
  } as const;
}

function parseFixture<TMessageIds extends string>(
  fixture: string,
  suggestions?: readonly SuggestionOutput<TMessageIds>[] | null,
) {
  const errorRegExp
    = /^(?<indent>\s*)(?<error>~+)\s*\[(?<id>\w+)\s*(?<data>.*?)(?:\s*(?<suggest>suggest)\s*(?<indices>[\d\s]*))?\]\s*$/;
  const lines: string[] = [];
  const errors: TestCaseError<TMessageIds>[] = [];
  let suggestFound = false;
  fixture.split('\n').forEach((line) => {
    const match = errorRegExp.exec(line);
    if (match?.groups) {
      const column = match.groups.indent.length + 1;
      const endColumn = column + match.groups.error.length;
      const { length } = lines;
      errors.push({
        column,
        data: JSON.parse(match.groups.data || '{}') as TSESLint.ReportDescriptorMessageData,
        endColumn,
        endLine: length,
        line: length,
        messageId: match.groups.id as TMessageIds,
        ...getSuggestions(
          suggestions,
          Boolean(match.groups.suggest),
          match.groups.indices?.trim(),
        ),
      });
      if (match.groups.suggest) {
        suggestFound = true;
      }
    } else {
      lines.push(line);
    }
  });
  if (suggestions && !suggestFound) {
    throw new Error('Suggestions specified but no \'suggest\' annotation found.');
  }
  return {
    code: lines.join('\n'),
    errors,
  };
}
