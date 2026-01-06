import { User } from "lucide-react";

export function UserProfileHeader({ name, role, image }) {
    return (
        <div className="flex items-center gap-2">
            {/* Avatar Container */}
            <div className="relative w-9 h-9">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full rounded-full object-cover border border-neutral-300"
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-200 rounded-full flex items-center justify-center">
                        <User size={22} className="text-neutral-600" />
                    </div>
                )}

                {/* Online Indicator */}
                <span className="absolute -bottom-0 -right-1 block w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            {/* Name + Role */}
            <div className="hidden md:block">
                <h2 className="text-sm font-semibold">{name}</h2>
                <p className="text-xs text-neutral-500 capitalize">{role}</p>
            </div>
        </div>
    );
}
