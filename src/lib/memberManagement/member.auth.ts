"use server";

// import { AppEnvs } from "../core/read-env";
import { dbManager } from "../database/drizzle/drizzleAdapter";
import { IMemberBase, IMemberDetails } from "../models/member.model";
import { hashPassword, comparePassword } from "../hashPassword";
import { MemberRepository } from "./member.repository";
// import { MemberSessRepository } from "./memberSess.repository";
// import { URLSearchParams } from "url";

const memberRepo = new MemberRepository(dbManager);

export const registerMember = async (details: IMemberBase) => {
  try {
    const { password, ...otherDetails } = details;
    const hashedPassword = await hashPassword(password);
    const newUser = { password: hashedPassword, ...otherDetails };
    const result = await memberRepo.create(newUser);
    return "User registered successfully";
  } catch (err) {
    if (err instanceof Error) throw err;
  }
};

// const JWTLoginAuth = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const member = req.body as IMemberBase;
//     if (!member.email || !member.password)
//       throw new AppError(400, "Password and email can't be empty");

//     const memberFound = await memberRepo.getAllData(member.email);
//     if (!memberFound) throw new AppError(400, "User not found");
//     if (memberFound.status === "banned")
//       throw new AppError(403, "This account has been banned.");
//     const isPasswordValid = await comparePassword(
//       member.password,
//       memberFound.password
//     );
//     if (!isPasswordValid) throw new AppError(401, "Invalid Password");
//     const payload = { id: memberFound.id, role: memberFound.role };

//     const accessToken = generateAccessToken(payload);
//     const refreshToken = generateRefreshToken(payload);

//     const sessionCreated = await memberSessionRepo.create({
//       id: memberFound.id,
//       refreshToken,
//     });
//     const refreshTokenName = `${memberFound.id}_refreshToken`;
//     const accessTokenName = `${memberFound.id}_accessToken`;
//     res.cookie(refreshTokenName, refreshToken, {
//       secure: true, //process.env.NODE_ENV === "production",
//       sameSite: "none",
//       path: "/",
//       httpOnly: true,
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });
//     res.json({ accessTokenName: accessToken, name: memberFound.name });
//   } catch (error) {
//     next(
//       error instanceof AppError
//         ? error
//         : error instanceof Error
//         ? new AppError(500, error.message)
//         : new AppError(500, "Facing some server issue, Try again later")
//     );
//   }
// };

// const googleAuthCallback = async (req: CustomRequest, res: Response) => {
//   const code = req.query.code as string;
//   try {
//     // Exchange the authorization code for tokens

//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);

//     const idToken = tokens.id_token;

//     if (!idToken) {
//       return res.status(400).send("Authentication failed");
//     }

//     // Verify the ID token and extract user info
//     const ticket = await oauth2Client.verifyIdToken({
//       idToken,
//       audience: AppEnvs.GOOGLE_CLIENT_ID!,
//     });

//     const payload = ticket.getPayload();
//     if (!payload || !payload.email) {
//       return res.status(400).send("Invalid token payload");
//     }

//     const email = payload.email;
//     const name = payload.name || "";

//     // Check if the user exists in database
//     let user: IMemberDetails | null = (await memberRepo.getAllData(email))!;

//     if (!user) {
//       const preFillquery = new URLSearchParams({ email, name }).toString();
//       res.redirect(`http://localhost:5173/member/register?${preFillquery}`);
//     } else {
//       // Generate JWT tokens for the user
//       const tokenPayload = { id: user.id, role: user.role };
//       const accessToken = generateAccessToken(tokenPayload);
//       const refreshToken = generateRefreshToken(tokenPayload);

//       // Store the refresh token in database
//       const updatedUser = await memberSessionRepo.create({
//         id: user.id,
//         refreshToken,
//       });

//       // Set refresh token in the cookie and respond with the access token
//       res.cookie(`refreshToken_${user.id}`, refreshToken, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "none",
//         path: "/",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       });

//       res.cookie(`accessToken_${user.id}`, accessToken, {
//         httpOnly: false,
//         secure: true,
//         sameSite: "none",
//         path: "/",
//         maxAge: 15 * 60 * 1000,
//       });

//       res.json({ accessToken, name: user.name });
//     }
//   } catch (error) {
//     console.error("Google OAuth error", error);
//     res.status(500).send("Authentication failed");
//   }
// };

// const logout = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     if (req.authentication && req.authentication.id) {
//       const cookieName = `${req.authentication?.id}_refreshToken`;
//       if (req.cookies[cookieName]) {
//         const refreshToken = req.cookies[cookieName];
//         await memberSessionRepo.delete(refreshToken);
//         res.clearCookie(cookieName, { httpOnly: true });
//         return res.json({ message: "User logged out successfully" });
//       } else throw new AppError(400, "Session expired, login again.");
//     } else throw new AppError(400, "Invalid Request");
//   } catch (error) {
//     next(
//       error instanceof AppError
//         ? error
//         : error instanceof Error
//         ? new AppError(500, error.message)
//         : new AppError(500, "Facing some server issue, Try again later")
//     );
//   }
// };

// const googleAuth = (req: CustomRequest, res: Response) => {
//   const authUrl = oauth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: ["profile", "email"],
//   });
//   res.json({ authUrl });
// };

//   return {
//     registerMember,
//     // JWTLoginAuth,
//     // googleAuth,
//     // googleAuthCallback,
//     // logout,
//   };
// };
