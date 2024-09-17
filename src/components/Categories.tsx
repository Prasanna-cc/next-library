// import { ListItem } from "./TransactionMenu";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "./ui/navigation-menu";

// const genres = [
//   { title: "Fiction", href: "/books?genre=fiction" },
//   { title: "Non-Fiction", href: "/books?genre=non-fiction" },
//   { title: "Mystery", href: "/books?genre=mystery" },
//   { title: "Science Fiction", href: "/books?genre=sci-fi" },
//   { title: "Fantasy", href: "/books?genre=fantasy" },
//   { title: "Biography", href: "/books?genre=biography" },
//   { title: "History", href: "/books?genre=history" },
//   { title: "Self-Help", href: "/books?genre=self-help" },
// ];

// export function CategoriesMenu() {
//   return (
//     <NavigationMenu>
//       <NavigationMenuList>
//         <NavigationMenuItem>
//           <NavigationMenuTrigger>
//             <div className="flex items-center gap-1">
//               <span className="hidden md:inline-flex">Categories</span>
//             </div>
//           </NavigationMenuTrigger>
//           <NavigationMenuContent>
//             <ul className="w-max grid gap-3 p-4 md:grid-cols-2">
//               {genres.map((genre) => (
//                 <ListItem
//                   key={genre.title}
//                   title={genre.title}
//                   href={genre.href}
//                 />
//               ))}
//             </ul>
//           </NavigationMenuContent>
//         </NavigationMenuItem>
//       </NavigationMenuList>
//     </NavigationMenu>
//   );
// }

// export const CategoriesNav = () => (
//   <div className=" hidden md:inline-flex md:gap-2">
//     <CategoriesMenu />
//   </div>
// );
