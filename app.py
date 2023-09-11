from functions import *
import asyncio

async def main():
    while True:
        try:
            keyword = "computer"
            state_task = asyncio.create_task(display_state("Listening", display))
            text = await listen_speech(loop, display, state_task)
            split_text = text.split(keyword)
            if keyword in text and len(split_text) > 1 and len(split_text[1].strip()) > 0:
                actual_text = split_text[1].strip()
                heard_message = f"Heard: {actual_text}"
                response_message = await query_openai(actual_text, display)
                
                stop_event_heard = asyncio.Event()
                heard_task = asyncio.gather(speak(heard_message, stop_event_heard), updateLCD(heard_message, display, stop_event=stop_event_heard))

                stop_event_response = asyncio.Event()
                response_task = asyncio.gather(speak(response_message, stop_event_response), updateLCD(response_message, display, stop_event=stop_event_response))

                await heard_task
                log_event(heard_message)

                await response_task
                log_event(response_message)
        except sr.UnknownValueError:
            error_message = "Sorry, I did not understand that"
            await handle_error(error_message, state_task, display)
        except sr.RequestError as e:
            error_message = f"Could not request results; {e}"
            await handle_error(error_message, state_task, display)
        except Exception as e:
            error_message = f"Something Went Wrong: {e}"
            await handle_error(error_message, state_task, display)

# Ensure network is connected before starting
if __name__ == "__main__":
    # Initialize LCD
    display = initLCD()
    state_task = display_state("Initializing", display)
    while not network_connected():
        time.sleep(1)
        message = "Network not connected"
        log_event(f"Error: {message}")
        updateLCD(message, display, error=True)
        stop_event = asyncio.Event()
        speak(message, stop_event)
        if network_connected(): break
    
    # Start main loop
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
    loop.close()