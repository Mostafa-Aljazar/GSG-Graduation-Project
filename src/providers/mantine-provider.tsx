import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';


// Removed the import for '@mantine/dropzone/styles.css' because,
// Mantine v7 no longer provides a styles.css file for the Dropzone component.
// Dropzone now uses internal styling and does not require external CSS imports.
// import '@mantine/dropzone/styles.css';


import '@mantine/tiptap/styles.css';

import {
  createTheme,
  DirectionProvider,
  MantineColorsTuple,
  MantineProvider,
  rem,
} from '@mantine/core';
import { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Notifications } from '@mantine/notifications';

const primary: MantineColorsTuple = [
  '#f2f8f4',
  '#e5ede7',
  '#c5dacb',
  '#a3c6ad',
  '#86b593',
  '#74ab83',
  '#69a67a',
  '#589167',
  '#4d815b',
  '#3e704c',
] as const;

const secondary: MantineColorsTuple = [
  '#fdf9e9',
  '#f6f1d8',
  '#ece2b0',
  '#e2d185',
  '#dac360',
  '#d4bb49',
  '#d2b63c',
  '#b9a02d',
  '#a58e25',
  '#8e7a17',
] as const;

const text: MantineColorsTuple = [
  '#eff6fa',
  '#e6e8e9',
  '#cdcece',
  '#b1b3b4',
  '#999b9d',
  '#898d8f',
  '#808689',
  '#6d7477',
  '#5e676b',
  '#4c5a60',
] as const;

export const theme = createTheme({
  black: '#2B261E',
  breakpoints: {
    xs: '450px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },

  colors: {
    primary,
    secondary,
    text,
  },

  // fontFamilyMonospace: "Monaco, Courier, monospace",
  primaryColor: 'primary',
  radius: {
    sm: '0.35rem',
    md: '0.55rem',
    lg: '0.8rem',
    xl: '1rem',
  },

  components: {
    Divider: {
      defaultProps: {
        color: '#DFDEDC',
      },
    },
    Badge: {
      defaultProps: {
        size: 'lg',
        radius: 'xl',
        fw: 600,
        variant: 'light',
        style: {
          textTransform: 'capitalize',
        },
      },
    },
    Menu: {
      defaultProps: {
        shadow: 'lg',
      },
    },
    Input: {
      defaultProps: {
        size: 'md',
        fw: 500,
        c: 'primary',
        classNames: {
          input: '[type="tel"]:!text-left placeholder:text-sm ',
        },
      },
    },

    Select: {
      defaultProps: {
        size: 'md',
        fw: 500,
        rightSection: <ChevronDown size={12} />,
        classNames: {
          input: ' placeholder:text-sm',
        },
        labelProps: {
          style: {
            fontSize: '14px',
          },
        },
      },
    },

    TextInput: {
      defaultProps: {
        size: 'md',
        classNames: {
          input: ' placeholder:text-sm',
        },

        labelProps: {
          style: {
            fontSize: '14px',
          },
        },
      },
    },
    TagsInput: {
      defaultProps: {
        size: 'md',
        classNames: {
          inputField: ' placeholder:text-sm',
        },

        labelProps: {
          style: {
            fontSize: '14px',
          },
        },
      },
    },
    NumberInput: {
      defaultProps: {
        size: 'md',
        classNames: {
          input: ' placeholder:text-sm',
        },

        labelProps: {
          style: {
            fontSize: '14px',
          },
        },
      },
    },

    Button: {
      defaultProps: {
        fw: 500,
        size: 'md',
      },
    },

    RadioGroup: {
      defaultProps: {
        labelProps: {
          fw: 500,
        },
      },
    },
    Radio: {
      defaultProps: {
        fw: 600,
        c: '#817C74',
      },
    },
  },

  defaultRadius: 'md',
  fontSizes: {
    xs: rem(11),
    sm: rem(14),
    md: rem(16),
    lg: rem(18),
    xl: rem(20),
    '2xl': rem(28),
  },
  headings: {
    fontWeight: '600',
    sizes: {
      h1: {
        fontSize: rem(36),
      },
      h2: {
        fontSize: rem(30),
      },
    },
  },
});

interface Props {
  children: ReactNode;
}

export default function Mantine_Provider({ children }: Props) {
  return (
    <DirectionProvider detectDirection>
      <MantineProvider theme={theme}>
        <Notifications />
        <> {children}</>
      </MantineProvider>
    </DirectionProvider>
  );
}
