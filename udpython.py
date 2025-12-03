import random
import string
import time

def clear():
    print("\n" * 50)

def header():
    print("="*40)
    print("🔥 UDBOSS AI MINI TOOLKIT 🔥".center(40))
    print("="*40)

def menu():
    print("\nChoose a tool:")
    print("1. Password Generator")
    print("2. Number Guessing Game")
    print("3. Mood / Advice Generator")
    print("4. Simple Calculator")
    print("5. Exit")

def password_generator():
    clear()
    header()
    length = int(input("Enter password length: "))
    chars = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(random.choice(chars) for _ in range(length))
    print(f"\nYour generated password: {password}")
    input("\nPress Enter to return to menu...")

def number_guessing_game():
    clear()
    header()
    number = random.randint(1, 50)
    attempts = 0
    print("Guess the number between 1 and 50!")
    while True:
        guess = int(input("Your guess: "))
        attempts += 1
        if guess < number:
            print("Too low!")
        elif guess > number:
            print("Too high!")
        else:
            print(f"🎉 Correct! You guessed it in {attempts} attempts.")
            break
    input("\nPress Enter to return to menu...")

def mood_advice_generator():
    clear()
    header()
    moods = ["Happy","Sad","Excited","Lazy","Motivated","Tired"]
    advice = [
        "Keep pushing forward!",
        "Take a deep breath.",
        "Celebrate your small wins.",
        "Rest is productive too.",
        "Challenge yourself today!",
        "Believe in yourself."
    ]
    print(f"Your mood: {random.choice(moods)}")
    print(f"UDBOSS Advice: {random.choice(advice)}")
    input("\nPress Enter to return to menu...")

def simple_calculator():
    clear()
    header()
    print("Enter an expression (example: 5+3*2):")
    expr = input(">>> ")
    try:
        result = eval(expr)
        print(f"Result: {result}")
    except:
        print("Invalid expression!")
    input("\nPress Enter to return to menu...")

# Main loop
while True:
    clear()
    header()
    menu()
    choice = input("\nEnter choice (1-5): ")
    if choice == "1":
        password_generator()
    elif choice == "2":
        number_guessing_game()
    elif choice == "3":
        mood_advice_generator()
    elif choice == "4":
        simple_calculator()
    elif choice == "5":
        clear()
        print("🚀 UDBOSS AI MINI TOOLKIT EXITING... Stay unstoppable!")
        time.sleep(1)
        break
    else:
        print("Invalid choice. Try again.")
        time.sleep(1)
