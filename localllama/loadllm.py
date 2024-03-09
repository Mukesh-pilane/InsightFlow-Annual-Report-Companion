from langchain.chains import LLMChain
from langchain_community.llms import GradientLLM
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler


class Loadllm:
    @staticmethod
    def load_llm():
        callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])
        # Prepare the LLM

        llm = GradientLLM(
            # `ID` listed in `$ gradient model list`
            model="6fd9d674-c159-418f-98d7-689af2b11715_model_adapter",
            # # optional: set new credentials, they default to environment variables
            # gradient_workspace_id=os.environ["GRADIENT_WORKSPACE_ID"],
            # gradient_access_token=os.environ["GRADIENT_ACCESS_TOKEN"],
            model_kwargs=dict(max_generated_token_count=400,temperature= 0.75, max_length= 3000, Stream=True),
            # callback_manager= callback_manager,
            callbacks=[StreamingStdOutCallbackHandler()]
        )

        return llm