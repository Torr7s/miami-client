export class Logger {
  private readonly colors = {
    PURPLE: '\u001b[34m',
    GREEN: '\x1b[32m',
    RED: '\x1b[31m',
    RESET: '\x1b[0m',
    YELLOW: '\x1b[33m'
  }

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

  constructor(private readonly className: string) { };

  public clear(): void {
    console.clear();
  }

  public error(message: string, content?: any): void {
    message = content ? `${message}\n${content}` : message;

    console.error(`${this.currentTime} ${this.colors.RED}[ERROR] ${this.className}${this.colors.RESET} ${message}`);
  }

  public info(message: string, content?: any): void {
    message = content ? `${message}\n${content}` : message;

    console.info(`${this.currentTime} ${this.colors.GREEN}[INFO] ${this.className}${this.colors.RESET} ${message}`);
  }

  public warn(message: string, content?: any): void {
    message = content ? `${message}\n${content}` : message;

    console.warn(`${this.currentTime} ${this.colors.YELLOW}[WARN]  ${this.className}${this.colors.RESET} ${message}`);
  }
}