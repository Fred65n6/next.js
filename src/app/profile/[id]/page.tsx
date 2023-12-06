"use client";

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import ThemeSwitcher from "../../components/switchTheme/page";
import { RiEdit2Fill } from "react-icons/ri";
import { CgClose } from "react-icons/cg";
import { SlLogout } from "react-icons/sl";
import Image from "next/image";
import User from "@/models/userModel"
import Link from "next/link";

interface Genre {
    _id: string;
    genre_name: string;
  }

interface Venue {
    _id: string;
    venue_name: string;
}

interface Artist {
    artist_name: string;
    artist_dob: string;
    artist_image: string;
    artist_nation: string;
    artist_full_namde: string;
    artist_genre:string;
}

interface User {
    _id: string;
    isArtist: boolean;
  }

  interface Concert {
    concert_name: string;
  }


export default function UserProfile({params}: any) {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string>("");
    const [isArtist, setIsArtist] = useState(false);
    const [genres, setGenres] = useState<any[]>([]);
    const [venues, setVenues] = useState<any[]>([]);
    const [artist, setArtist] = useState<any[]>([]);
    const [concerts, setConcerts] = useState<any[]>([]);


    const [data, setData] = useState({
        username: "unknown",
        userId: "",
        userEmail: "unknown"
    });

    const [user, setUser] = React.useState({
        newpassword: "",
        email: "",
        password: "",
        confirmpassword: "",
        newUsername: "",
        _id: "",
    });

    const logout = async () => {
        try {
            setLoading(true);
            await axios.get("/api/users/logout");
            console.log("log out successfull");
            localStorage.setItem('shouldReload', 'true');
            router.push("/");
        } catch (error: any) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getUserDetails = async () => {
        try {
            const res = await axios.get("/api/users/cookieUser");
            console.log(res.data);
            const userData = res.data.data;
            const adminData: User = res.data.data;
            if (adminData.isArtist) {
                setIsArtist(true)
            } 
            setGenres(res.data.data.genres);
            setVenues(res.data.data.venues);
            setArtist(res.data.data.artist);
            setConcerts(res.data.data.concerts);
            
            setData({
                username: userData.username,
                userId: userData._id,
                userEmail: userData.email,
            });
        } catch (error: any) {
            console.error(error.message);
        }
    };


    useEffect(() => {
        getUserDetails();
        setUser({...user, email: data.userEmail, _id: data.userId});
    }, [data.userEmail, data.userId]);


    // -- MODAL FUNCTIONS START
    const openChangePasswordModal = () => {
        const modal = document.getElementById("changePasswordModal");
        modal?.classList.remove("hidden");
        modal?.classList.add("grid");
    };

    const openChangeUsernamedModal = () => {
        const UsernameModal = document.getElementById("changeUsernameModal");
        UsernameModal?.classList.remove("hidden");
        UsernameModal?.classList.add("grid");
    };

    const openDeleteUserModal = () => {
        const modal = document.getElementById("deleteUserModal");
        modal?.classList.remove("hidden");
        modal?.classList.add("grid");
    };

    const closeUsernameModule = () => {
        const changeUsernameModule = document.getElementById("changeUsernameModal");
        changeUsernameModule?.classList.add("hidden");
        changeUsernameModule?.classList.remove("grid");
    };
      
    const closePasswordModule = () => {
        const modal = document.getElementById("changePasswordModal");
        modal?.classList.add("hidden");
        modal?.classList.remove("grid");
    };

    const closeDeleteUserModule = () => {
        const changeUsernameModule = document.getElementById("deleteUserModal");
        changeUsernameModule?.classList.add("hidden");
        changeUsernameModule?.classList.remove("grid");
    };

    // -- CHANGE USERNAME
    const changeUsername = async () => {
        try {
            setLoading(true);
            const response = await axios.post(
                "/api/users/changeUsername",
                user
            );
            console.log("username changed", response.data);
            // showUsernameChangeMessage();
        } catch (error: any) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.error
            ) {
                setError(error.response.data.error);
            } else {
                setError("An error occurred during signup.");
            }
            console.log("API signup failed", error);
        } finally {
            setLoading(false);
            closeUsernameModule();
            window.location.reload();

        }
    };

    const deleteUser = async () => {
        try {
            setLoading(true);
            const response = await axios.post(
                "/api/users/deleteUser",
                { _id: user._id, password: user.password } // Adjust accordingly
            );
            console.log("User deleted", response.data);
            logout();
        } catch (error) {
            console.error("Delete user failed", error);
            // Handle the error as needed
        } finally {
            setLoading(false);
            closeUsernameModule();
        }
    };

    // -- CHANGE PASSWORD
    const changePassword = async () => {
        try {
            setLoading(true);
            const response = await axios.post(
                "/api/users/changePassword",
                user
            );
            console.log("password changed", response.data);
            // showPasswordChangeMessage();
        } catch (error: any) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.error
            ) {
                setError(error.response.data.error);
            } else {
                setError("An error occurred during signup.");
            }
            console.log("API signup failed", error);
        } finally {
            setLoading(false);
            closeUsernameModule();
        }
    };


    return (
        <div className="grid pt-8">
            <h1 className="dark:text-white font-bold text-3xl">Profile / <span className="text-[#5311BF] dark:text-purple-500">{data.username}</span></h1>
            
            <section className="flex gap-4 mt-10">
                <div className="bg-purple-100 w-full gap-4 py-8 rounded-lg align-middle justify-start px-8 flex flex-col">
                    <div className="flex flex-col item-center justify-between">
                        <p className="text-sm dark:text-black">Email:</p>
                        <div className="flex justify-between">
                            <span className="brand_purple">{data.userEmail}</span>
                           
                        </div>
                    </div>

                    <div className="flex flex-col item-center justify-between">
                        <p className="text-sm dark:text-black">Username:</p>
                        <div className="flex justify-between">
                            <span className="brand_purple">{data.username}</span>
                            <button onClick={openChangeUsernamedModal}>
                                <RiEdit2Fill className="dark:fill-black"/>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col item-center justify-between">
                        <p className="text-sm dark:text-black">Password:</p>
                        <div className="flex justify-between">
                            <span className="brand_purple">********</span>
                            <button onClick={openChangePasswordModal}>
                                <RiEdit2Fill className="dark:fill-black"/>
                            </button>
                        </div>
                    </div>
                    


                    <div className="flex items-center justify-between mb-8 md:hidden">
                        <p className="text-sm dark:text-black">
                            Dark mode
                        </p>

                        <ThemeSwitcher/>
                    </div>
                </div>
            </section>

            {isArtist ? (
                <div className="">
                <section className="flex gap-4 mt-10 first-letter:">
                <div className="bg-purple-100 w-full gap-4 py-8 rounded-lg align-middle justify-start px-8 flex flex-col">
                
                <div className="flex justify-between">
                    <h2 className="text-black font-bold text-xl">Artist info</h2>
                    <button >
                        <a href="/edit-user-artist">
                        <RiEdit2Fill className="dark:fill-black"/>
                        </a>
                        
                    </button>
                </div>

                <div className="w-full">
                        {artist.map((artist: any) => (
                            <article
                            className="flex gap-8"
                                key={artist.artist_name}>

                                <div className="">
                                <Image
                                src={`https://concertify.s3.eu-central-1.amazonaws.com/${artist.artist_image}`}
                                width={200}
                                height={200}
                                alt="artist image"
                                className="h-full rounded-lg w-[100%] object-cover"
                            />
                                </div>

                                <div className="grid gap-4">

                                <p >Artist name: <br /><span className="text-base brand_purple">{artist.artist_name}</span></p>

                                <p >Artist name: <br /><span className="text-base brand_purple">{artist.artist_full_name}</span></p>

                                <p >Date of birth: <br /><span className="text-base brand_purple">{artist.artist_dob}</span></p>

                                <p >Artist genre: <br /><span className="text-base brand_purple">{artist.artist_genre[0].genre_name}</span></p>

                                <p >Artist nation: <br /><span className="text-base brand_purple">{artist.artist_nation}</span></p>

                                <p >Artist description: <br /><span className="text-base brand_purple">{artist.artist_description}</span></p>

                                </div>
                            </article>
                        ))}
                    </div>
                </div>
                </section>

                <section className="mt-10">
                <div className="bg-purple-100 w-full gap-4 py-8 rounded-lg align-middle justify-start px-8 flex flex-col">
                    <ul className="flex gap-4">
                            {concerts.map((concerts: any) => (
                            <li
                                className="w-full text-sm"
                                key={concerts.concert_name}>

                            <Link href={"/concerts/" + concerts.concert_id} key={concerts.concert_id}>

                                <p >Concerts: <br /><span className="text-base brand_purple">{concerts.concert_name}</span></p>

                            </Link>
                                
                            </li>
                        ))}     
                    </ul>
                </div>
                </section>
                </div>
                ) : (
                    <div className=""></div>
                )}

            
            {/* PREFERENCES */}

            {!isArtist ? (
            <section className="flex flex-col md:flex-row gap-4 mt-10">
                <div className="bg-purple-100 w-full gap-4 py-8 rounded-lg align-middle justify-start px-8 flex flex-col">                    
                    <div className="flex flex-col gap-4">
                        <h2 className="text-black font-bold text-xl">Preferred genres</h2>
                            <ul className="flex flex-wrap gap-2">
                                {genres.map((genre: any) => (
                                    <article
                                        className="w-fit rounded-full border-[1px] border-solid border-[#5311BF] py-2 px-8 text-[#5311BF]"
                                        key={genre._id}>
                                        <p>{genre.genre_name}</p>
                                    </article>
                                    ))}
                                </ul>
                    </div>
                </div>

                <div className="bg-purple-100 w-full gap-4 py-8 rounded-lg align-middle justify-start px-8 flex flex-col">                    
                    <div className="flex flex-col gap-4">
                        <h2 className="text-black font-bold text-xl">Preferred venues</h2>
                        <ul className="flex flex-wrap gap-2">
                            {venues.map((venue: any) => (
                                <article
                                    className="w-fit rounded-full border-[1px] border-solid border-[#5311BF] py-2 px-8 text-[#5311BF]"
                                    key={venue._id}>
                                    <p>{venue.venue_name}</p>
                                </article>
                            ))}
                        </ul>
                        
                    </div>
                </div>
            </section>
            ) : (
                <div className=""></div>
            )}

            {/* LOG OUT LINK */}
            <div className="w-full flex justify-between">
            <div className="">
            <button
                onClick={logout}
                className="w-full flex gap-2 items-center mt-12 mb-12"
            >
                <span className="text-[#5311BF] dark:text-white">Log out</span>
                <SlLogout className="fill-[#5311BF] dark:fill-white"/>
            </button>
            </div>

            <div className="">
            <button
                onClick={openDeleteUserModal}
                className="w-full flex gap-2 items-center mt-12 mb-12"
            >
                <span className="text-red-400 dark:text-white">Delete user</span>
                
            </button>
            </div>
            </div>
            
            

            {/* CHANGE USERNAME MODAL */}
            <div id="changeUsernameModal" className="fixed top-0 left-0 bg-slate-900/50 w-full h-screen items-center justify-center hidden backdrop-blur-sm z-50">
                <div className="p-10 mx-4 md:m-0 flex flex-col items-center w-fill md:w-[800px] bg-white rounded-lg dark:bg-[#12082a]">
                    <button
                        type="button"
                        onClick={closeUsernameModule}
                        className="cursor-pointer ml-[100%]"
                    >
                        <CgClose/>
                    </button>

                    <div className="flex flex-col w-full gap-2">
                        <span className="w-full text-xl font-semibold text-[#5311BF] dark:text-purple-500 mb-6">Change username</span>
                        <input
                            readOnly={true}
                            className="hidden"
                            type="text"
                            id="email"
                            value={user.email}
                            onChange={(e) => setUser({...user, email: e.target.value})}
                            placeholder=""
                        />
                        <label htmlFor="password" className="w-fit text-sm text-gray-600 dark:text-gray-100">Choose a new username</label>
                        <input
                            className="input_field"
                            type="text"
                            id="newUsername"
                            placeholder="Start typing..."
                            value={user.newUsername}
                            onChange={(e) =>
                                setUser({...user, newUsername: e.target.value})
                            }
                        
                        />
                        {error && <div className="text-red-500">{error}</div>}

                    </div>

                    <button
                        onClick={changeUsername}
                        className="m-4 brand_gradient px-12 py-4 rounded-full text-white mt-8"
                    >
                        Save
                    </button>
                </div>
            </div>

            {/* CHANGE PASSWORD MODAL */}
            <div id="changePasswordModal" className="fixed top-0 left-0 bg-slate-900/50 w-full h-screen items-center justify-center hidden backdrop-blur-sm z-50">
                <div className="p-10 mx-4 md:m-0 flex flex-col items-center w-fill md:w-[800px] bg-white rounded-lg dark:bg-[#12082a]">
                    <button
                        type="button"
                        onClick={closePasswordModule}
                        className="cursor-pointer ml-[100%]"
                    >
                        <CgClose/>
                    </button>
                    <div className="flex flex-col gap-4 items-center w-full">
                        <span className="w-full text-xl font-semibold text-[#5311BF] dark:text-purple-500 mb-6">Change password</span>
                            <div className="flex flex-col gap-4 w-full">
                                <div className="flex flex-col w-full gap-2">
                                    <input
                                        readOnly={true}
                                        className="m-2 p-2 rounded-md text-left text-black bg-slate-200 hidden"
                                        type="text"
                                        id="email"
                                        value={user.email}
                                        onChange={(e) => setUser({...user, email: e.target.value})}
                                        placeholder=""
                                    />
                                    <label htmlFor="password" className="w-fit text-sm text-gray-600 dark:text-gray-100">Old password</label>
                                    <input
                                        className="input_field"
                                        type="password"
                                        id="password"
                                        value={user.password}
                                        onChange={(e) =>
                                            setUser({...user, password: e.target.value})
                                        }
                                        placeholder="Type your old password..."
                                    />
                                </div>

                                <div className="flex flex-col w-full gap-2">
                                    <label htmlFor="password" className="w-fit text-sm text-gray-600 dark:text-gray-100">New password</label>
                                    <input
                                        className="input_field"
                                        type="password"
                                        id="password"
                                        value={user.newpassword}
                                        onChange={(e) =>
                                            setUser({...user, newpassword: e.target.value})
                                        }
                                        placeholder="Type new password..."
                                    />
                                </div>

                                <div className="flex flex-col w-full gap-2">
                                    <label htmlFor="confirm_password" className="w-fit text-sm text-gray-600 dark:text-gray-100">
                                        Confirm new password
                                    </label>
                                    <input
                                        className="input_field"
                                        type="password"
                                        id="confirm_password"
                                        value={user.confirmpassword}
                                        onChange={(e) =>
                                            setUser({...user, confirmpassword: e.target.value})
                                        }
                                        placeholder="Confirm new password..."
                                    />
                                </div>
                            </div>
                        {error && <div className="text-red-500">{error}</div>}
                    </div>
                    <button
                        onClick={changePassword}
                        className="m-4 brand_gradient px-12 py-4 rounded-full text-white mt-8"
                    >
                        Save
                    </button>
                </div>
            </div>

             {/* DELETE USER MODAL */}
             <div id="deleteUserModal" className="fixed top-0 left-0 bg-slate-900/50 w-full h-screen items-center justify-center hidden backdrop-blur-sm z-50">
                <div className="p-10 mx-4 md:m-0 flex flex-col items-center w-fill md:w-[800px] bg-white rounded-lg dark:bg-[#12082a]">
                    <button
                        type="button"
                        onClick={closeDeleteUserModule}
                        className="cursor-pointer ml-[100%]"
                    >
                        <CgClose/>
                    </button>

                    <div className="flex flex-col w-full gap-2">
                        <span className="w-full text-xl font-semibold text-[#5311BF] dark:text-purple-500 mb-6">Change username</span>
                        <input
                            readOnly={true}
                            type="text"
                            id="email"
                            value={user._id}
                            placeholder=""
                        />
                        <input
                            readOnly={true}
                            type="text"
                            id="email"
                            value={user.email}
                            placeholder=""
                        />
                        <label htmlFor="password" className="w-fit text-sm text-gray-600 dark:text-gray-100">Choose a new username</label>
                        <input
                            className="input_field"
                            type="text"
                            id="password"
                            placeholder="Start typing..."
                            value={user.password}
                            onChange={(e) =>
                                setUser({...user, password: e.target.value})
                            }
                        
                        />
                        {error && <div className="text-red-500">{error}</div>}

                    </div>

                    <button
                        onClick={deleteUser}
                        className="m-4 brand_gradient px-12 py-4 rounded-full text-white mt-8"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}