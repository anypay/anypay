
abstract class BaseOracle {

  abstract name: string;

  async registerAddress(name: string): Promise<string> {
    return name;
  }

  async deregisterAddress(name: string): Promise<boolean> {
    return true;
  }
}

export { BaseOracle }

