/**
 * Represents the main logger
 * 
 * @class
 * @classdesc Log messages of the application
 */
export class Logger {
  private readonly colors = {
    PURPLE: '\u001b[34m',
    GREEN: '\x1b[32m',
    RED: '\x1b[31m',
    RESET: '\x1b[0m',
    YELLOW: '\x1b[33m'
  }

  /**
   * Get the current time
   * 
   * @private @method
   * 
   * @returns {String} date - The current log formatted date
   */
  private get currentTime(): string {
    const date: string = new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'long',
      timeStyle: 'long',
      timeZone: 'America/Sao_Paulo'
    }).format(new Date());

    return `${this.colors.PURPLE}[${date}]${this.colors.RESET}`;
  }

  static it(className: string): Logger {
    return new Logger(className);
  }

  /**
   * Create a new Logger instance
   * 
   * @constructs Logger
   * 
   * @param {String} className - The class name instancing the logger
   */
  constructor(private readonly className: string) { };

  /**
   * Clear console content before send new logs
   * 
   * @public @method
   * 
   * @returns {void} void
   */
  clear(): void {
    console.clear();
  }

  /**
   * Print an error message and its content
   * 
   * @public @method
   * 
   * @param {String} message - The error message  
   * @param {any} content - The error content
   * 
   * @returns {void} void
   */
  error(message: string, content?: any): void {
    message = content ? `${message}\n${content}` : message;

    console.error(`${this.currentTime} ${this.colors.RED}[ERROR] ${this.className}${this.colors.RESET} ${message}`);
  }

  /**
   * Print an info message and its content
   * 
   * @public @method
   * 
   * @param {String} message - The info message
   * @param {any} content - The info content
   * 
   * @returns {void} void
   */
  info(message: string, content?: any): void {
    message = content ? `${message}\n${content}` : message;

    console.info(`${this.currentTime} ${this.colors.GREEN}[INFO] ${this.className}${this.colors.RESET} ${message}`);
  }

  /**
   * Print a warn message and its content
   * 
   * @public @method
   * 
   * @param {String} message - The warn message 
   * @param {any} content - The warn content
   * 
   * @returns {void} void
   */
  warn(message: string, content?: any): void {
    message = content ? `${message}\n${content}` : message;

    console.warn(`${this.currentTime} ${this.colors.YELLOW}[WARN]  ${this.className}${this.colors.RESET} ${message}`);
  }
}