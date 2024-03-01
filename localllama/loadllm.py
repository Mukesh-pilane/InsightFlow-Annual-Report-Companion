from langchain_community.llms import Replicate
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler



class Loadllm:
    @staticmethod
    def load_llm():
        callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])
        # Prepare the LLM

        llm = Replicate(
            model="a16z-infra/llama13b-v2-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
            model_kwargs={"temperature": 0.75, "max_length": 3000},
            callback_manager=callback_manager,
        )  
        
        # LlamaCpp(
        #     model_path=model_path,
        #     n_gpu_layers=40,
        #     n_batch=512,
        #     n_ctx=2048,
        #     f16_kv=True,  # MUST set to True, otherwise you will run into problem after a couple of calls
        #     callback_manager=callback_manager,
        #     verbose=True,
        # )

        return llm