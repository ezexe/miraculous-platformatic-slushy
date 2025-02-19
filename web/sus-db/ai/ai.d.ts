import { type FastifyReply, type FastifyPluginAsync } from 'fastify'
import { type GetHeadersOptions, type StatusCode1xx, type StatusCode2xx, type StatusCode3xx, type StatusCode4xx, type StatusCode5xx } from '@platformatic/client'
import { type FormData } from 'undici'

declare namespace ai {
  export type Ai = {
    /**
     * @param req - request parameters object
     * @returns the API response body
     */
    prompt(req: PromptRequest): Promise<PromptResponses>;
    /**
     * @param req - request parameters object
     * @returns the API response body
     */
    stream(req: StreamRequest): Promise<StreamResponses>;
  }
  export interface AiOptions {
    url: string
  }
  export const ai: AiPlugin;
  export { ai as default };
  export interface FullResponse<T, U extends number> {
    'statusCode': U;
    'headers': Record<string, string>;
    'body': T;
  }

  export type PromptRequest = {
    'prompt': string;
    'chatHistory'?: Array<{ 'prompt': string; 'response': string }>;
  }

  /**
   * Default Response
   */
  export type PromptResponseOK = { 'response': string }
  /**
   * Default Response
   */
  export type PromptdefaultResponse = { 'code'?: string; 'message': string }
  export type PromptResponses =
    PromptResponseOK
    | PromptdefaultResponse

  export type StreamRequest = {
    'prompt': string;
    'chatHistory'?: Array<{ 'prompt': string; 'response': string }>;
  }

  export type StreamResponseOK = unknown
  export type StreamResponses =
    FullResponse<StreamResponseOK, 200>

}

type AiPlugin = FastifyPluginAsync<NonNullable<ai.AiOptions>>

declare module 'fastify' {
  interface ConfigureAi {
    getHeaders(req: FastifyRequest, reply: FastifyReply, options: GetHeadersOptions): Promise<Record<string,string>>;
  }
  interface FastifyInstance {
    configureAi(opts: ConfigureAi): unknown
  }

  interface FastifyRequest {
    /**
     * Platformatic
     *
     * This is a service built on top of Platformatic
     */
    'ai': ai.Ai;
  }
}

declare function ai(...params: Parameters<AiPlugin>): ReturnType<AiPlugin>;
export = ai;
