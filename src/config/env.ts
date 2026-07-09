/**
 * Environment Configuration Loader
 * Centralizes all env var access with validation
 * Best Practice: Validate at startup to catch config issues early
 */

interface EnvironmentConfig {
  supabase: {
    url: string;
    publishableKey: string;
  };
  api: {
    baseUrl: string;
    environment: 'development' | 'staging' | 'production';
    timeout: number;
  };
  payment: {
    stripePublicKey?: string;
    stripeSecretKey?: string;
    shopifyStoreName?: string;
  };
  email: {
    apiKey?: string;
    fromAddress?: string;
  };
  features: {
    enableShop: boolean;
    enableAdmin: boolean;
    enableCheckout: boolean;
  };
}

/**
 * Validate required environment variables at app startup
 * Throws error if critical vars are missing
 */
const validateEnvironment = (): void => {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_PUBLISHABLE_KEY',
  ];

  const missing = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missing.length > 0) {
    console.error(
      'Missing critical environment variables:',
      missing.join(', ')
    );
    throw new Error(
      `Configuration Error: Missing env vars [${missing.join(', ')}]. ` +
      'Please check .env.example and your deployment configuration.'
    );
  }
};

/**
 * Parse boolean from env strings
 */
const parseBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
  if (!value) return defaultValue;
  return value === 'true' || value === '1' || value === 'yes';
};

/**
 * Load and validate all environment configuration
 * Call once at app initialization
 */
export const loadEnvironmentConfig = (): EnvironmentConfig => {
  validateEnvironment();

  return {
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL,
      publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    api: {
      baseUrl:
        import.meta.env.VITE_API_URL ||
        (import.meta.env.MODE === 'production'
          ? 'https://api.ditechai.com'
          : 'http://localhost:8080'),
      environment:
        (import.meta.env.VITE_API_ENV as EnvironmentConfig['api']['environment']) ||
        'development',
      timeout: 30000, // 30s
    },
    payment: {
      stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
      stripeSecretKey: import.meta.env.VITE_STRIPE_SECRET_KEY,
      shopifyStoreName: import.meta.env.VITE_SHOPIFY_STORE_NAME,
    },
    email: {
      apiKey: import.meta.env.VITE_EMAIL_SERVICE_API_KEY,
      fromAddress: import.meta.env.VITE_EMAIL_FROM,
    },
    features: {
      enableShop: parseBoolean(import.meta.env.VITE_ENABLE_SHOP, true),
      enableAdmin: parseBoolean(import.meta.env.VITE_ENABLE_ADMIN, true),
      enableCheckout: parseBoolean(import.meta.env.VITE_ENABLE_CHECKOUT, false),
    },
  };
};

/**
 * Singleton instance - load once
 */
let envConfig: EnvironmentConfig | null = null;

export const getEnvConfig = (): EnvironmentConfig => {
  if (!envConfig) {
    envConfig = loadEnvironmentConfig();
  }
  return envConfig;
};

/**
 * Secure logging - never log secrets
 */
export const logEnvironmentInfo = (): void => {
  const config = getEnvConfig();
  console.info('[Environment] Configuration loaded:', {
    api: config.api,
    features: config.features,
    // Deliberately omitting secrets
  });
};
